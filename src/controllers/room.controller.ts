import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { errorResponse, successResponse } from "../utils/responseHandler";
import { Booking } from "../models/booking.model";

//create room (Admin only)
export const createRoom = async (req: Request, res: Response) => {
  const { name, roomNo, capacity, materials } = req.body;

  try {
    const room = await Room.create({
      name,
      roomNo,
      capacity,
      materials,
    });
    return successResponse(res, "Room added successfully", room, 201);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

//get All Rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No Data Found",
        data: [],
      });
    }
    return successResponse(res, "Rooms retrieved successfully", rooms);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

//get single room
export const getSingleRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    return successResponse(res, "Room retrieved successfully", room);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// update room (admin only)
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    return successResponse(res, "Room updated successfully", room);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

//delete room (permanent delete, admin only, cascade delete bookings)
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    // Cascade delete bookings for this room
    await Booking.deleteMany({ room: req.params.id });
    return successResponse(
      res,
      "Room and related bookings deleted successfully",
      room
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Upload room photo and update imagePaths
export const uploadRoomPhoto = async (
  req: Request & { file?: any },
  res: Response
) => {
  if (!req.file || !req.params.id) {
    return errorResponse(res, "No file or room ID provided", [], 400);
  }
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return errorResponse(res, "Room not found", [], 404);
    }
    // Save S3 public URL in imagePaths array
    room.imagePaths = room.imagePaths || [];
    room.imagePaths.push(req.file.location);
    await room.save();
    return successResponse(res, "Room photo uploaded successfully", room);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};
