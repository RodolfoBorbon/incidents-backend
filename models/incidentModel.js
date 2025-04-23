//Back-End/model/incidentmodel.js

const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');  // Changed from bcrypt to bcryptjs
const jwt = require("jsonwebtoken")
var Schema  = mongoose.Schema;

var incidentSchema = new Schema(
    {
        incidentRecordNumber: {  
            type: String,
            required: true
        },
    incidentDescription: {
        type: String,
        required: true
    },
    incidentPriority: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhoneNumber: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    incidentNarrative: {
        type: String,
        required: true
    },
    incidentStatus: {  
        type: String,
        default: "NEW" // Default value is "NEW"
    },
    incidentResolution: { 
        type: String,
        default: "" 
    },
    closedDate: { 
        type: Date,
        default: null 
    },
},
    { timestamps: true } 
  );
module.exports = mongoose.model('incident',incidentSchema);