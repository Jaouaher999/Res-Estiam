import { model, Schema } from "mongoose";

type RoomType = {
  name: string;
  roomNo: number;
  capacity: number;
  materials: string[];
  imagePath?: string;
  isDeleted: boolean;
};

const roomSchema = new Schema<RoomType>(
  {
    name: { type: String, required: true },
    roomNo: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },
    materials: { type: [String], default: [] },
    imagePath: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

roomSchema.index({ roomNo: 1 }, { unique: true });

const Room = model<RoomType>("Room", roomSchema);

export default Room;
