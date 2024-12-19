import express from "express";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import session from "express-session";
import fs from "fs";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

const uri = "mongodb://127.0.0.1:27017/myDB";
const client = new MongoClient(uri);

// Connect to MongoDB and initialize myCollection and destinations
async function connectDb() {
    try {
        await client.connect();
        console.log("Connected to database");

        const db = client.db("myDB");

        // Ensure 'myCollection'
        const myCollection = db.collection("myCollection");
        const myCollectionCount = await myCollection.countDocuments();
        if (myCollectionCount === 0) {
            console.log("Initializing empty 'myCollection'...");
            await myCollection.insertMany([]); // Ensure collection creation
            console.log("'myCollection' initialized as an empty collection.");
        } else {
            console.log("'myCollection' collection already exists.");
        }

        // Ensure 'destinations' exists and initialize if empty
        const destinationsCollection = db.collection("destinations");
        const destinationsCount = await destinationsCollection.countDocuments();
        if (destinationsCount === 0) {
            console.log("Populating 'destinations' collection...");
            const destinationsData = JSON.parse(
                fs.readFileSync(path.join(__dirname, "myDB.destinations.json"), "utf-8")
            );

            // Transform $oid fields into ObjectId
            const transformedData = destinationsData.map((destination) => {
                if (destination._id && destination._id.$oid) {
                    destination._id = new ObjectId(destination._id.$oid);
                }
                return destination;
            });

            await destinationsCollection.insertMany(transformedData);
            console.log("'destinations' collection populated successfully.");
        } else {
            console.log("'destinations' collection already exists.");
        }
    } catch (err) {
        console.error("Error connecting to database or populating data:", err);
        process.exit(1);
    }
}


connectDb();

// Access the users collection
const db = client.db("myDB");
const usersCollection = db.collection("myCollection");

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("home");
    }
});


app.get("/registration", (req, res) => {
    res.render("registration");
});

// Registration POST request
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.send("Both fields are required.");
    }

    try {
        // Check if username already exists
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            return res.send("Username already taken.");
        }

        // Insert new user into the database
        await usersCollection.insertOne({ username, password, list: [] });


        // Redirect to login page after successful registration
        res.redirect("/?message=Registration successful. Please log in.");
    } catch (err) {
        console.error("Error registering user:", err);
        res.send("There was an error with the registration process.");
    }
});


app.get("/paris", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("paris");
    }
});


app.get("/rome", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("rome");
    }
});

app.get("/islands", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("islands");
    }
});

app.get("/hiking", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("hiking");
    }
});

app.get("/cities", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("cities");
    }
});

app.get("/inca", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("inca");
    }
});

app.get("/annapurna", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("annapurna");
    }
});

app.get("/santorini", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("santorini");
    }
});

app.get("/bali", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("bali");
    }
});

app.get("/wanttogo", async (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    }

    try {
        // Ensure the Mongo client is connected before performing operations
        await connectDb();

        // Retrieve the user's data from the database
        const user = await usersCollection.findOne({ username: req.session.user.username });

        // Ensure the user's `list` attribute exists
        const destinations = user.list || [];

        // Render the template with the destinations
        res.render("wanttogo", { destinations });
    } catch (err) {
        console.error("Error retrieving Want-to-Go list:", err);
        res.send("An error occurred while retrieving your list.");
    }
});

// Login POST request
app.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Both fields are required.");
    }

    try {
        // Find the user in the database
        const user = await usersCollection.findOne({ username });

        // Check if user exists and password is correct
        if (!user || user.password !== password) {
            return res.send("Invalid username or password.");
        }

        // Create session for logged-in user
        req.session.user = user;

        // Redirect to home page
        res.redirect("/home");
    } catch (err) {
        console.error("Error logging in user:", err);
        res.send("There was an error with the login process.");
    }
});

app.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.render("error", {
            message: "You are not logged in. Please log in first to access this page.",
            redirectPath: "/",
        });
    } else {
        res.render("home");
    }
});

//Handling the backend for adding the destination
app.post("/add-to-want-to-go-list", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "User not logged in." });
    }

    const destination = req.body.destination;

    if (!destination) {
        return res.status(400).json({ success: false, message: "Destination is required. " + req.body });
    }

    try {
        // Find the logged-in user's record
        const username = req.session.user.username;
        const user = await usersCollection.findOne({ username });

        // Check if destination is already in the list
        if (user.list.includes(destination)) {
            return res.status(400).json({ success: false, message: "Destination already in the list." });
        }

        // Update user's list in the database
        await usersCollection.updateOne(
            { username },
            { $push: { list: destination } }
        );

        res.json({ success: true, message: "Destination added successfully." });
    } catch (err) {
        console.error("Error adding destination:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

app.post('/search', async (req, res) => {

    const searchQuery = req.body.Search; // Get the search query from the search form textbox
    if (!searchQuery) {
        return res.status(400).send('Search query is required');
    }

    try {
        await client.connect(); // Connect to the database

        const db = client.db('myDB');
        const collection = db.collection('destinations');

        // Perform the search operation
        const results = await collection.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).toArray();

        if (results.length === 0) {
            return res.status(404).render('searchResults', { results: [], message: 'Destination not found' });
        }

        res.render('searchResults', { results, message: null });
    } catch (err) {
        console.error('Error during search:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        client.close(); // Close the database connection
    }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Web Server is listening at port " + (process.env.PORT || 3000));
});