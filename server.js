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

const app = express()
const port = 4800

// Connect to MongoDB
const mongodatabaseURL = 'mongodb+srv://rodolfoborbon:teknu6-dibJod-kuqvyn@cluster0.8ndpeek.mongodb.net/Incident_Management_App?retryWrites=true&w=majority';
mongoose.connect(mongodatabaseURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("MongoDb Connected......")

// Start the server
app.listen(port,()=>{
    console.log("Server is running port " + port);
})

});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Passport configuration
app.use(require('express-session')({
    secret: 'This is a secret sentence',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Use the routes
app.use(incidentRoutes);
app.use(authenticationRoutes);



