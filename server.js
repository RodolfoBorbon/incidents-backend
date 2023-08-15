// Import necessary modules and setup the server
var express = require('express');
var server = express();
var incidentRoutes = require('./routes/incidents');
var authenticationRoutes = require("./routes/authentication");
var mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local")

const app = express();
const port = process.env.PORT || 4800;

// Secret configurations
const MONGO_DB_URL = 'mongodb+srv://rodolfoborbon:teknu6-dibJod-kuqvyn@cluster0.8ndpeek.mongodb.net/Incident_Management_App?retryWrites=true&w=majority';
const SESSION_SECRET = 'This is a secret sentence';
const CORS_ORIGIN = 'https://comp229-incidents-frontend.azurewebsites.net'; 

// Connect to MongoDB
mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDb Connected......");

    // Start the server
    app.listen(port, () => {
        console.log("Server is running on port " + port);
    });
});

// Middleware setup
app.use(cors({
    origin: CORS_ORIGIN
}));

app.use(bodyParser.json());

// Passport configuration
app.use(require('express-session')({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use the routes
app.use(incidentRoutes);
app.use(authenticationRoutes);



