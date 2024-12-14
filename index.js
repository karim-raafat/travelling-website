import express from "express";
import path from "path";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const __dirname = path.resolve();

// Set up EJS for templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

// Set up body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up express-session for managing sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// MongoDB setup (use IPv4 address)
const uri = "mongodb://127.0.0.1:27017/myDB"; // Use IPv4 address for the local connection
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDb() {
    try {
        await client.connect();
        console.log("Connected to database");
    } catch (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); // Exit the application if MongoDB cannot be connected
    }
}

// Connect to the database once the app starts
connectDb();

// Access the users collection from the database
const db = client.db('myDB');
const usersCollection = db.collection('myCollection');

// Routes

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/home", (req, res) => {
    res.render("home");
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
        await usersCollection.insertOne({ username, password });

        // Redirect to login page after successful registration
        res.redirect("/login?message=Registration successful. Please log in.");
    } catch (err) {
        console.error("Error registering user:", err);
        res.send("There was an error with the registration process.");
    }
});


app.get("/paris", (req, res) => {
    res.render("paris");
});

app.get("/rome", (req, res) => {
    res.render("rome");
});

app.get("/islands", (req, res) => {
    res.render("islands");
});

app.get("/hiking", (req, res) => {
    res.render("hiking");
});

app.get("/cities", (req, res) => {
    res.render("cities");
});

app.get("/inca", (req, res) => {
    res.render("inca");
});

app.get("/annapurna", (req, res) => {
    res.render("annapurna");
});

app.get("/santorini", (req, res) => {
    res.render("santorini");
});

app.get("/bali", (req, res) => {
    res.render("bali");
});

app.get("/wanttogo", (req, res) => {
    //add code for calling the wanttogo destination from database
    res.render("wanttogo");
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
        return res.redirect("/login");
    }
    res.render("home", { user: req.session.user });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Web Server is listening at port " + (process.env.PORT || 3000));
});


// Route to handle search functionality
app.post('/search', async (req, res) => {
    const searchQuery = req.body.Search; // Get the search query from the search form textbox
    if (!searchQuery) {
        return res.status(400).send('Search query is required');
    }

    try {
        await client.connect(); // Connect to the database

        const db = client.db('myDB'); // Select the database
        const collection = db.collection('destinations'); // Select the collection

        // Perform the search operation
        const results = await collection.find({
            name: { $regex: searchQuery, $options: 'i' } // Case-insensitive substring match
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
