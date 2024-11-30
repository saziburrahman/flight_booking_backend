const Flight = require("../models/Flight");

exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchFlights = async (req, res) => {
  const {
    origin,
    destination,
    date,
    minPrice,
    maxPrice,
    airline,
    availableSeats,
    minDuration,
    maxDuration,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const query = {};
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    if (date) query.date = new Date(date);
    if (airline) query.airline = airline;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (availableSeats) query.availableSeats = { $gte: Number(availableSeats) };
    if (minDuration)
      query.duration = { ...query.duration, $gte: Number(minDuration) };
    if (maxDuration)
      query.duration = { ...query.duration, $lte: Number(maxDuration) };

    const flights = await Flight.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalFlights = await Flight.countDocuments(query);

    res.json({
      flights,
      totalFlights,
      totalPages: Math.ceil(totalFlights / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFlight = async (req, res) => {
  const {
    flightNumber,
    airline,
    origin,
    destination,
    date,
    time,
    price,
    availableSeats,
    duration,
  } = req.body;

  try {
    const flight = await Flight.create({
      flightNumber,
      airline,
      origin,
      destination,
      date,
      time,
      price,
      availableSeats,
      duration,
    });
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedFlight)
      return res.status(404).json({ error: "Flight not found" });
    res.json(updatedFlight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);
    if (!deletedFlight)
      return res.status(404).json({ error: "Flight not found" });
    res.json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
