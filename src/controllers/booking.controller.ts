import { Request, Response } from "express";
import Slot from "../models/slot.model";
import Room from "../models/room.model";
import Booking from "../models/booking.model";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const createBooking = async (req: Request, res: Response) => {
  const { date, slots, room, user } = req.body;

  try {
    // Fetch slots and room details in parallel
    const [selectedSlots, selectedRoom] = await Promise.all([
      Slot.find({
        _id: { $in: slots },
        isBooked: false,
      }),
      Room.findById(room),
    ]);

    // Check if the room exists
    if (!selectedRoom) {
      return errorResponse(res, "Room not found", [], 404);
    }

    // Check if all selected slots are available
    if (selectedSlots.length !== slots.length) {
      return errorResponse(res, "Some slots are already booked", [], 400);
    }

    // Calculate the total amount
    const totalAmount = selectedSlots.length * selectedRoom.pricePerSlot;

    // Create a new booking
    const booking = await Booking.create({
      room,
      slots,
      user,
      date,
      totalAmount,
    });

    // Mark the slots as booked
    await Slot.updateMany({ _id: { $in: slots } }, { isBooked: true });

    // Populate the booking with detailed room, slots, and user info
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "room",
        select: "name roomNo floorNo capacity pricePerSlot amenities isDeleted",
      })
      .populate({
        path: "slots",
        select: "room date startTime endTime isBooked",
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
    const bookings = await Booking.find().populate("room user slots").exec();

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
      .populate("room slots")
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
  const { isConfirmed } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isConfirmed },
      { new: true }
    );

    if (!booking) {
      return errorResponse(res, "Booking not found", [], 404);
    }

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
