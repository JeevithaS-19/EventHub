const Event = require("../models/Event");

// Get all events with search and filters
const getEvents = async (req, res) => {
    try {
        const { search, category, location } = req.query;

        const filter = {};

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by location
        if (location) {
            filter.location = location;
        }

        // Search by title, description, or organizer
        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    organizer: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        const events = await Event.find(filter).sort({ date: 1 });

        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};


// Get a single event
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
};


// Create an event
const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json(event);

    } catch (error) {
        res.status(400).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};


// Update an event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(400).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};


// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};


// Export controllers
module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};