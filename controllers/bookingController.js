const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

exports.createBooking = async (req, res) => {
  const { flightId, numberOfSeats } = req.body;

  try {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (numberOfSeats > flight.availableSeats) {
      return res.status(400).json({ error: "Not enough available seats" });
    }

    const totalPrice = flight.price * numberOfSeats;

    const booking = await Booking.create({
      userId: req.user.id,
      flightId,
      numberOfSeats,
      totalPrice,
    });

    flight.availableSeats -= numberOfSeats;
    await flight.save();

    await sendEmail({
      to: user.email,
      subject: "Flight Booking Confirmation",
      text: `Dear ${
        user.username
      },\n\nYour booking has been confirmed for flight ${
        flight.flightNumber
      }.\n\nDetails:\n- Airline: ${flight.airline}\n- Origin: ${
        flight.origin
      }\n- Destination: ${
        flight.destination
      }\n- Date: ${flight.date.toDateString()}\n- Time: ${
        flight.time
      }\n- Number of Seats: ${numberOfSeats}\n- Total Price: $${totalPrice}\n\nThank you for choosing our service!\n\nBest regards,\nFlight Booking System Team`,
    });

    res.status(201).json({
      message: "Booking created successfully. Confirmation email sent.",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id }).populate(
      "flightId"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId flightId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedBooking)
      return res.status(404).json({ error: "Booking not found" });
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking)
      return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
