import express from "express";
import path from "path";
import { MongoClient } from "mongodb";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));


function getClient() {
    const uri = "mongodb://localhost:27017/myDB";
    return new MongoClient(uri);
}

const client = getClient();

client.connect()
    .then(() => {
        console.log("Connected to database");
        client.close();
    })
    .catch(err => {
        console.error("Error connecting to database:", err);
    });


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/registration", (req, res) => {
    res.render("registration");
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

app.listen(process.env.PORT || 3000, () => {
    console.log("Web Server is listening at port " + (process.env.PORT || 3000));
});
