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
    res.render("login");
});

app.get("/registration", (req, res) => {
    res.render("registration");
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Web Server is listening at port " + (process.env.PORT || 3000));
});
