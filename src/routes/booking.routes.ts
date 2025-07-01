import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller";
import { protect, admin } from "../middlewares/authMiddleware";

const router = express.Router();

// Create a booking (authenticated user only)
router.post("/bookings", protect, createBooking);

// Get all bookings (admin only)
router.get("/bookings", protect, admin, getAllBookings);

// Get the current user's bookings
router.get("/my-bookings", protect, getUserBookings);

// Update a booking (admin only)
router.put("/bookings/:id", protect, admin, updateBooking);

// Delete a booking (soft delete - admin only)
router.delete("/bookings/:id", protect, admin, deleteBooking);

export default router;
