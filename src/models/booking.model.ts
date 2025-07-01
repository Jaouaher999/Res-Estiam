import { model, Schema, Types } from "mongoose";

type BookingType = {
  room: Types.ObjectId;
  slots: Types.ObjectId[];
  user: Types.ObjectId;
  date: string;
  totalAmount: number;
  isConfirmed: string;
  isDeleted: boolean;
};

const bookingSchema = new Schema<BookingType>(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    slots: { type: [Schema.Types.ObjectId], ref: "Slot", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    isConfirmed: {
      type: String,
      enum: ["confirmed", "unconfirmed", "canceled"],
      default: "unconfirmed",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = model<BookingType>("Booking", bookingSchema);
export default Booking;
