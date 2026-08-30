const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"]
        },

        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true,
            minlength: [
                10,
                "Description must be at least 10 characters"
            ]
        },

        date: {
            type: Date,
            required: [true, "Event date is required"]
        },

        time: {
            type: String,
            required: [true, "Event time is required"],
            trim: true
        },

        location: {
            type: String,
            required: [true, "Event location is required"],
            trim: true,
            minlength: [
                2,
                "Location must be at least 2 characters"
            ]
        },

        category: {
            type: String,
            required: [true, "Event category is required"],
            trim: true,
            minlength: [
                2,
                "Category must be at least 2 characters"
            ]
        },

        organizer: {
            type: String,
            required: [true, "Organizer name is required"],
            trim: true,
            minlength: [
                2,
                "Organizer name must be at least 2 characters"
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Event",
    eventSchema
);