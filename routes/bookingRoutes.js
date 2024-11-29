const express = require("express");
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/user/:id", protect, getUserBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBooking);
router.delete("/:id", protect, adminOnly, deleteBooking);

module.exports = router;
