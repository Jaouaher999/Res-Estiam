import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../utils/validators";
import User from "../models/user.model";
import { errorResponse, successResponse } from "../utils/responseHandler";

// Register User
export const registerUser = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.errors });

  const { name, email, password, phone, address, role } = req.body;

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
      address,
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
        address: user.address,
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
        address: user.address,
        token,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, (error as Error).message);
  }
};
