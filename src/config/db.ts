import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || "");
    console.log("MongoDB connection established! 🚀");
  } catch (error) {
    console.error(
      "Encountered a MongoDB connection issue. ❌",
      "\nError details:",
      error,
      "\nPlease verify your database credentials and configuration."
    );
    process.exit(1);
  }
};

export default connectDB;
