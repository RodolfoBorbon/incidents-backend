//Back-end/controllers/incidents.js

const incidentModel = require('../models/incidentModel');
const currentDate = new Date();

const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
const optionsTime = { hour: '2-digit', minute: '2-digit' };

const formattedDate = currentDate.toLocaleDateString('en-US', optionsDate);
const formattedTime = currentDate.toLocaleTimeString('en-US', optionsTime);



async function generateRecordNumber() {
  // Use today's date in 'ddMMyy' format
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yy = String(today.getFullYear()).substr(-2);
  let date = dd + mm + yy;

  // Get the count of incidents in the database
  let count = await incidentModel.countDocuments();

  // Increment count for the new incident
  count = count + 1;

  // Pad with leading zeroes to have a 7-digit count
  let countStr = String(count).padStart(7, '0');

  // Return the unique record number
  return date + '-' + countStr;
}

exports.createIncident = async (req, res) => {
  try {
    const incident = new incidentModel(req.body);
    incident.incidentRecordNumber = await generateRecordNumber();    // a. Generate the incidentRecordNumber

    // Include the initial comments in the incidentNarrative
    const initialNarrative = req.body.incidentNarrative ? req.body.incidentNarrative : '';
    incident.incidentNarrative = `Created at ${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()}: ${initialNarrative}`;    // a. Add a timestamp to the narrative

    await incident.validate(); 
    await incident.save();

    res.status(201).send({
      status: true,
      message: "Incident ticket Created!"
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await incidentModel.find({ incidentStatus: { $ne: "Closed" } });
    res.send(incidents);
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.getIncidentById = async (req, res) => {
  try {
    const _id = req.params.id;
    const incident = await incidentModel.findById(_id);
    if (!incident) {
      return res.status(404).send();
    }
    res.status(200).send(incident);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateIncident = async (req, res) => {
  try {
    const _id = req.params.id;
    const incident = await incidentModel.findById(_id);
    if (!incident) {
        return res.status(404).send();
    }

    // Format timestamp
    let timestamp = new Date();
    let options = { 
      year: '2-digit', 
      month: 'numeric', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    let formattedTimestamp = timestamp.toLocaleString('en-US', options);
    
    // Add userNarrative to the incidentNarrative with timestamp
    incident.incidentNarrative += `\nUpdated at ${formattedTimestamp}: ${req.body.userNarrative}`; 

    // Exclude userNarrative from the update operation
    let { userNarrative, ...updateData } = req.body;
    
    // Update the rest of the incident data
    Object.assign(incident, updateData);

    await incident.save();

    res.status(201).send({
        status: true,
        message: "Incident ticket updated!"
    });
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.deleteIncident = async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteIncidents = await incidentModel.findByIdAndDelete(_id);
    if (!deleteIncidents) {
      return res.status(404).send();
    }
    res.status(201).send({
      status: true,
      message: "Incident ticket Deleted!"
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.closeIncident = async (req, res) => {
  try {
    const _id = req.params.id;
    const incident = await incidentModel.findById(_id);
    if (!incident) {
      return res.status(404).send();
    }

    // Update the status to 'Closed'
    incident.incidentStatus = "Closed";

    // Update the incident resolution if provided in the request
    if(req.body.incidentResolution){
        incident.incidentResolution = req.body.incidentResolution;
    }

    // Update the incident closed date if provided in the request
    if(req.body.closedDate){
        incident.closedDate = new Date(req.body.closedDate);
    }

    await incident.save();
    res.status(200).send({
      status: true,
      message: "Incident closed successfully!",
      incident: incident
    });
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.getClosedIncidents = async (req, res) => {
  try {
    const closedIncidents = await incidentModel.find({ incidentStatus: "Closed" });
    res.send(closedIncidents);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateIncidentStatus = async (req, res) => {
  try {
    const _id = req.params.id;
    const status = req.body.status;
    const userNarrative = req.body.userNarrative;   // Get userNarrative from the request body
    const incident = await incidentModel.findById(_id);
    if (!incident) {
      return res.status(404).send();
    }

    // Append the userNarrative to the incidentNarrative
    incident.incidentNarrative += `\nUpdated at ${new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()}: ${userNarrative}`;

    incident.incidentStatus = status;
    await incident.save();
    res.status(200).send({
      status: true,
      message: "Incident status updated successfully!",
      incident: incident
    });
  } catch (error) {
    res.status(400).send(error);
  }
};