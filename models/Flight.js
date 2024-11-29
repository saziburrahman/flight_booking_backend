const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    airline: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", FlightSchema);
