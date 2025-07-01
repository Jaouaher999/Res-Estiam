import { model, Schema } from "mongoose";

type RoomType = {
  name: string;
  roomNo: number;
  floorNo: number;
  capacity: number;
  pricePerSlot: number;
  amenities: string[];
  isDeleted: boolean;
};

const roomSchema = new Schema<RoomType>(
  {
    name: { type: String, required: true },
    roomNo: { type: Number, required: true, unique: true },
    floorNo: { type: Number, required: true },
    capacity: { type: Number, required: true },
    pricePerSlot: { type: Number, required: true },
    amenities: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


roomSchema.index({ roomNo: 1 }, { unique: true });

const Room = model<RoomType>("Room", roomSchema);

export default Room;
