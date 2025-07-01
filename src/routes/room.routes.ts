import express from "express";
import { protect, admin } from "../middlewares/authMiddleware";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
} from "../controllers/room.controller";

const router = express.Router();

router.route("/").post(protect, admin, createRoom).get(getAllRooms);

router
  .route("/:id")
  .get(protect, getSingleRoom)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

export default router;
