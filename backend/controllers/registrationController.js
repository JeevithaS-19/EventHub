const Registration = require("../models/Registration");
const Event = require("../models/Event");


// =========================
// Register for an Event
// =========================

const registerForEvent = async (req, res) => {

    try {

        const { eventId, name, email } = req.body;


        // Check if event exists
        const event = await Event.findById(eventId);


        if (!event) {

            return res.status(404).json({
                message: "Event not found"
            });
        }


        // Check if email already registered
        const existingRegistration =
            await Registration.findOne({
                event: eventId,
                email: email.toLowerCase()
            });


        if (existingRegistration) {

            return res.status(409).json({
                message:
                    "You are already registered for this event"
            });
        }


        // Create registration
        const registration =
            await Registration.create({
                event: eventId,
                name,
                email
            });


        res.status(201).json({
            message: "Registration successful",
            registration
        });


    } catch (error) {

        res.status(400).json({
            message:
                "Failed to register for event",
            error: error.message
        });
    }
};


// =========================
// Get Registrations
// =========================

const getEventRegistrations = async (req, res) => {

    try {

        const registrations =
            await Registration.find({
                event: req.params.eventId
            }).sort({
                createdAt: -1
            });


        res.status(200).json(
            registrations
        );


    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch registrations",
            error: error.message
        });
    }
};


// =========================
// Delete Registration
// =========================

const deleteRegistration = async (req, res) => {

    try {

        const registration =
            await Registration.findByIdAndDelete(
                req.params.id
            );


        if (!registration) {

            return res.status(404).json({
                message:
                    "Registration not found"
            });
        }


        res.status(200).json({
            message:
                "Registration deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message:
                "Failed to delete registration",
            error: error.message
        });
    }
};


// =========================
// Export Controllers
// =========================

module.exports = {
    registerForEvent,
    getEventRegistrations,
    deleteRegistration
};