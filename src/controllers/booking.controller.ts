import { Request, Response } from "express";
import Room from "../models/room.model";
import Booking from "../models/booking.model";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createBooking = async (req: Request, res: Response) => {
  const { startDate, endDate, room, user } = req.body;

  try {
    // Check if the room exists
    const selectedRoom = await Room.findById(room);
    if (!selectedRoom) {
      return errorResponse(res, "Room not found", [], 404);
    }

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
      room,
      isDeleted: false,
      $or: [{ startDate: { $lt: endDate }, endDate: { $gt: startDate } }],
    });
    if (conflict) {
      return errorResponse(
        res,
        "Room is already booked for this time range",
        [],
        400
      );
    }

    // Create a new booking
    const booking = await Booking.create({
      room,
      user,
      startDate,
      endDate,
    });

    // Populate the booking with detailed room and user info
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "room",
        select: "name roomNo capacity materials isDeleted",
      })
      .populate({
        path: "user",
        select: "name email phone address role",
      });

    if (!populatedBooking) {
      return errorResponse(res, "Booking not found", [], 404);
    }

    return successResponse(
      res,
      "Booking created successfully",
      populatedBooking,
      201
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Get All Bookings (Only Accessible by Admin)
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate("room user").exec();

    if (bookings.length === 0) {
      return errorResponse(res, "No Data Found", [], 404);
    }

    return successResponse(
      res,
      "All bookings retrieved successfully",
      bookings
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Get User's Bookings (Only Accessible by Authenticated User)
export const getUserBookings = async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    return errorResponse(res, "User not authenticated", [], 401);
  }

  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room")
      .exec();

    if (bookings.length === 0) {
      return errorResponse(res, "No Data Found", [], 404);
    }

    return successResponse(
      res,
      "User bookings retrieved successfully",
      bookings
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Update Booking (Only Accessible by Admin)
export const updateBooking = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return errorResponse(res, "Booking not found", [], 404);
    }
    // If updating time, check for conflicts
    if (
      (startDate && startDate !== booking.startDate.toISOString()) ||
      (endDate && endDate !== booking.endDate.toISOString())
    ) {
      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        room: booking.room,
        isDeleted: false,
        $or: [
          {
            startDate: { $lt: endDate || booking.endDate },
            endDate: { $gt: startDate || booking.startDate },
          },
        ],
      });
      if (conflict) {
        return errorResponse(
          res,
          "Room is already booked for this time range",
          [],
          400
        );
      }
    }
    if (startDate) booking.startDate = startDate;
    if (endDate) booking.endDate = endDate;
    await booking.save();
    return successResponse(res, "Booking updated successfully", booking);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Delete Booking (Soft Delete, Only Accessible by Admin)
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!booking) {
      return errorResponse(res, "Booking not found", [], 404);
    }

    return successResponse(res, "Booking deleted successfully", booking);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};
