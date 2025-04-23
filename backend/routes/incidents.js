//Back-End/routes/incidents.js

const express = require("express");
const router = express.Router();
const incidentController = require('../controllers/incidents');


router.post('/incident/create', incidentController.createIncident); //This route is used to create a new incident.
router.get('/incidents', incidentController.getAllIncidents); //This route is used to get all incidents.
router.get('/incidents/:id', incidentController.getIncidentById);  //This route is used to get a specific incident by its ID.
router.patch('/incidents/:id', incidentController.updateIncident);  //This route is used to update a specific incident by its ID.
router.delete('/incidents/:id', incidentController.deleteIncident); // This route is used to delete a specific incident by its ID.
router.patch('/incidents/close/:id', incidentController.closeIncident); //This route is used to close a specific incident by its ID.
router.get('/closed-incidents', incidentController.getClosedIncidents);  //This route is used to get all closed incidents.
router.patch('/incidents/:id/status', incidentController.updateIncidentStatus);  //This route is used to update the status of a specific incident by its ID.


module.exports = router;

