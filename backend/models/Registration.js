const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "Event ID is required"]
        },

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [
                2,
                "Name must be at least 2 characters"
            ]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);