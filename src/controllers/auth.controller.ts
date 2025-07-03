import { Request, Response } from "express";
import {
  loginSchema,
  signupSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../utils/validators";
import { User } from "../models/user.model";
import { errorResponse, successResponse } from "../utils/responseHandler";

// Register User
export const registerUser = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const { name, email, password, phone, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, "User already exists", [], 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });

    return successResponse(
      res,
      "User registered successfully",
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      201
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = user.getSignedJwtToken();
    return successResponse(
      res,
      "User logged in successfully",
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const { oldPassword, newPassword } = req.body;

  try {
    if (!req.user || !req.user._id) {
      return errorResponse(res, "User not authenticated", [], 401);
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, "User not found", [], 404);
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return errorResponse(res, "Old password is incorrect", [], 400);
    }
    user.password = newPassword;
    await user.save();
    return successResponse(res, "Password changed successfully", null);
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  try {
    if (!req.user || !req.user._id) {
      return errorResponse(res, "User not authenticated", [], 401);
    }
    const updates: any = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return errorResponse(res, "User not found", [], 404);
    }
    return successResponse(res, "Profile updated successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};
