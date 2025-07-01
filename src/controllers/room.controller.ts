import { Request, Response } from "express";
import Room from "../models/room.model";
import { errorResponse, successResponse } from "../utils/responseHandler";

//create room (Admin only)
export const createRoom = async (req: Request, res: Response) => {
  const { name, roomNo, floorNo, capacity, pricePerSlot, amenities } = req.body;

  try {
    const room = await Room.create({
      name,
      roomNo,
      floorNo,
      capacity,
      pricePerSlot,
      amenities,
    });
    return successResponse(res, "Room added successfully", room, 201);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

//get All Rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({ isDeleted: false });
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

//delete room (soft delete, admin only)

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    return successResponse(res, "Room deleted successfully", room);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};
