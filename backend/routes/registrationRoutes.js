const express = require("express");

const {
    registerForEvent,
    getEventRegistrations
} = require("../controllers/registrationController");

const router = express.Router();


// Register for an event
router.post("/", registerForEvent);


// Get registrations for an event
router.get("/:eventId", getEventRegistrations);


module.exports = router;