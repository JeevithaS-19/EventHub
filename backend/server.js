const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const app = express();
connectDB();


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "EventHub API is running successfully!"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`EventHub server running on port ${PORT}`);
});