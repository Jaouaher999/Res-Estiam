import { model, Schema, Types } from "mongoose";

type BookingType = {
  room: Types.ObjectId;
  user: Types.ObjectId;
  startDate: Date;
  endDate: Date;
};

const bookingSchema = new Schema<BookingType>(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Booking = model<BookingType>("Booking", bookingSchema);
export { Booking };
