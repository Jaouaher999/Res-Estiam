import express from "express";
import { protect, admin } from "../middlewares/authMiddleware";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  uploadRoomPhoto,
} from "../controllers/room.controller";
import { upload } from "../utils/s3";

const router = express.Router();

router.route("/").post(protect, admin, createRoom).get(getAllRooms);

router
  .route("/:id")
  .get(protect, getSingleRoom)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

router.post(
  "/:id/photo",
  protect,
  admin,
  upload.single("photo"),
  uploadRoomPhoto
);

export default router;
