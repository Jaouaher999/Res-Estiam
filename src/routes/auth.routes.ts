import express from "express";
import {
  loginUser,
  registerUser,
  changePassword,
  updateProfile,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/change-password", protect, changePassword);
router.put("/update-profile", protect, updateProfile);

export default router;
