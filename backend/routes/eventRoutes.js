const express = require("express");

const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const router = express.Router();

// GET all events
router.get("/", getEvents);

// GET single event
router.get("/:id", getEventById);

// POST create event
router.post("/", createEvent);

// PUT update event
router.put("/:id", updateEvent);

// DELETE event
router.delete("/:id", deleteEvent);

module.exports = router;