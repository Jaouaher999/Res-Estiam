import { model, Schema, Types } from "mongoose";

type SlotType = {
  room: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

const slotSchema = new Schema<SlotType>(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Slot = model<SlotType>("Slot", slotSchema);
export default Slot;
