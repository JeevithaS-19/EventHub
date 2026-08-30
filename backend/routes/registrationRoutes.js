const express = require("express");

const router = express.Router();

const {
    registerForEvent,
    getEventRegistrations,
    deleteRegistration
} = require("../controllers/registrationController");


// Register for an event
router.post(
    "/",
    registerForEvent
);


// Get registrations for an event
router.get(
    "/:eventId",
    getEventRegistrations
);


// Delete a registration
router.delete(
    "/:id",
    deleteRegistration
);


module.exports = router;