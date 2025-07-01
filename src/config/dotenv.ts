import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT || !process.env.DB_URL || !process.env.JWT_SECRET) {
  console.error('Please provide PORT, MONGODB_URI, and JWT_SECRET in the .env file');
  process.exit(1);
}

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;