import express from "express";
import path from "path";


const app = express();
const __dirname = path.resolve();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "/public")));

app.get('/', (req, res) => {
    res.render('login'); // Render 'login.ejs'
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Web Server is listening at port ' + (process.env.PORT || 3000));
});



