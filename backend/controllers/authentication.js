//BACK-END/controllers/authentication.js: 

var User = require("../models/user");
var jwt = require('jsonwebtoken'); 

//Controller that handles the user registration
exports.register = function(req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email });
    
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.status(500).json({ message:"An error occurred during registration. " + err});
        }

        res.status(200).json({ message: "Registration successful."});
    });
};

//Controller that handles the login function
exports.login = function(req, res) {
    const user = req.user; // Passport.js attaches the authenticated user to the req object

    // Generate a JWT for the user
    const token = jwt.sign({ id: user._id }, 'Incident-Application-Centennial', {
        expiresIn: '24h' // the token expires in 24 hours
    });

    // Send the JWT to the client
    res.status(200).json({ message: "Logged in successfully.", token: token });
};


//Controller that handles the logout function
exports.logout = function(req, res) {
    req.logout();
    res.status(200).json({ mesagge: "Logged out successfully."});
};