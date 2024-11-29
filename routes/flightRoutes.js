const express = require("express");
const {
  getFlights,
  searchFlights,
  getFlightById,
  addFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flightController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFlights);
router.get("/search", searchFlights);
router.get("/:id", getFlightById);
router.post("/", protect, adminOnly, addFlight);
router.put("/:id", protect, adminOnly, updateFlight);
router.delete("/:id", protect, adminOnly, deleteFlight);

module.exports = router;
