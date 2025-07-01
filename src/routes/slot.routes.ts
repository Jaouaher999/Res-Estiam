import express from "express";
import { protect, admin } from "../middlewares/authMiddleware";
import { createSlots, getAvailableSlots } from "../controllers/slot.controller";

const router = express.Router();

router.route("/").post(protect, admin, createSlots)

router.route("/availability").get(protect, getAvailableSlots)

export default router;
