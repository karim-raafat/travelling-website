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

function getClient() {
    const uri = "mongodb://localhost:27017/myDB";
    return new MongoClient(uri);
}

// MongoDB setup (use IPv4 address)
const uri = "mongodb://127.0.0.1:27017/myDB"; // Use IPv4 address for the local connection
const client = getClient();

// Connect to MongoDB
async function connectDb() {
    try {
        await client.connect();
        client.connect()
            .then(() => {
                console.log("Connected to database");

            }).catch(err => {
                console.error("Error connecting to database:", err);
                process.exit(1);
            });
    }


        // Connect to the database once the app starts
    connectDb();
    // Access the users collection from the database
    const db = client.db('myDB');
    const usersCollection = db.collection('myCollection');
});

// Routes

app.get("/", (req, res) => {
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
        app.get("/paris", (req, res) => {
            res.render("paris");
        });

        // Redirect to login page after successful registration
        res.redirect("/login?message=Registration successful. Please log in.");
    } catch (err) {
        console.error("Error registering user:", err);
        res.send("There was an error with the registration process.");
    }
    app.get("/rome", (req, res) => {
        res.render("rome");
    });

    // Login route (you can create the login.ejs file for the front-end)
    app.get("/login", (req, res) => {
        res.render("login");
        app.get("/islands", (req, res) => {
            res.render("islands");
        });

        // Login POST request
        app.post("/login", async (req, res) => {
            const { username, password } = req.body;
            app.get("/hiking", (req, res) => {
                res.render("hiking");
            });

            if (!username || !password) {
                return res.send("Both fields are required.");
            }
            app.get("/cities", (req, res) => {
                res.render("cities");
            });

            try {
                // Find the user in the database
                const user = await usersCollection.findOne({ username });
                app.get("/inca", (req, res) => {
                    res.render("inca");
                });

                // Check if user exists and password is correct
                if (!user || user.password !== password) {
                    return res.send("Invalid username or password.");
                }
                app.get("/annapurna", (req, res) => {
                    res.render("annapurna");
                });

                // Create session for logged-in user
                req.session.user = user;
                app.get("/santorini", (req, res) => {
                    res.render("santorini");
                });

                // Redirect to home page
                res.redirect("/home");
            } catch (err) {
                console.error("Error logging in user:", err);
                res.send("There was an error with the login process.");
            }
            app.get("/bali", (req, res) => {
                res.render("bali");
            });

            app.get("/home", (req, res) => {
                if (!req.session.user) {
                    return res.redirect("/login");
                }
                res.render("home", { user: req.session.user });
                app.get("/wanttogo", (req, res) => {
                    //add code for calling the wanttogo destination from database
                    res.render("wanttogo");
                });

                // Start the server
                app.listen(process.env.PORT || 3000, () => {
                    console.log("Web Server is listening at port " + (process.env.PORT || 3000));
                });