import { Request, Response } from "express";
import Slot from "../models/slot.model";
import { successResponse, errorResponse } from "../utils/responseHandler";

// Create Slots (Admin Only)
export const createSlots = async (req: Request, res: Response) => {
  const { room, date, startTime, endTime } = req.body;

  try {
    // Slot duration in minutes
    const slotDuration = 60;
    const startMinutes =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);
    const endMinutes =
      parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
    const totalDuration = endMinutes - startMinutes;
    const numberOfSlots = totalDuration / slotDuration;

    // Prepare slots in batch
    const slots = Array.from({ length: numberOfSlots }, (_, i) => {
      const slotStart = new Date(date);
      slotStart.setMinutes(startMinutes + i * slotDuration);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + slotDuration);

      return {
        room,
        date,
        startTime: slotStart.toLocaleTimeString("en-US", { hour12: false }),
        endTime: slotEnd.toLocaleTimeString("en-US", { hour12: false }),
        isBooked: false, // Ensure the new slots are unbooked
      };
    });

    // Insert slots in bulk
    await Slot.insertMany(slots);

    return successResponse(res, "Slots created successfully", slots, 201);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Get Available Slots
export const getAvailableSlots = async (req: Request, res: Response) => {
  const { date, roomId } = req.query;
  try {
    // Construct the query
    const query: { isBooked: boolean; date?: string; room?: string } = { isBooked: false };
    if (date) query.date = date as string;
    if (roomId) query.room = roomId as string;

    const slots = await Slot.find(query).populate("room");
    if (slots.length === 0) {
      return errorResponse(res, "No Data Found", [], 404);
    }

    return successResponse(
      res,
      "Available slots retrieved successfully",
      slots
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};
