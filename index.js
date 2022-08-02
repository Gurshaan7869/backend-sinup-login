const express = require("express");
const app = express();
var mongoose = require("mongoose");
const bodyParser = require("body-parser");

const url = `mongodb+srv://admin:admin@whatsapp-mern-backend-c.z09p9.mongodb.net/users?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const User = mongoose.model("Users", userSchema);

// Starting the server at port 3000
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/UI/register.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/UI/login.html");
});

app.use(express.static("UI"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/UI/index.html");
});

app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

app.post("/register", (request, response) => {
    User.findOne({ email: request.body.email }, (err, userFound) => {
        const user = new User({
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
        });

        if (err) {
            console.log(err);
        } else {
            if (userFound) {
                console.log("userFound, entry rejected");
                response.sendFile(__dirname + "/UI/registerfail.html");
            } else {
                user.save();
                console.log("user not found, so we saved this user");
                response.sendFile(__dirname + "/UI/registered.html");
            }
        }
    });
});

app.post("/login", (request, response) => {
    User.findOne(
        { email: request.body.email, password: request.body.password },
        (err, userFound) => {
            if (err) {
                console.log(err);
            } else {
                if (userFound) {
                    console.log("userFound email" + userFound);
                    response.sendFile(__dirname + "/UI/loggedin.html");
                } else {
                    console.log("email or password is incorrect");
                    response.sendFile(__dirname + "/UI/loginfail.html");
                }
            }
        }
    );
});

app.listen(3000, function () {
    console.log("Server running on port 3000");
});
