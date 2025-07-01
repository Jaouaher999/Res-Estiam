import express, { Request, Response } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import authRoutes from "./routes/auth.routes";
import roomRoutes from "./routes/room.routes";
import slotRoutes from "./routes/slot.routes";
import bookingRoutes from "./routes/booking.routes";
import errorHandler from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import cors from "cors";
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to Meeting Room Booking System</h1>
    <p>Book your meeting rooms with ease and manage your reservations efficiently.</p>
  `);
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
