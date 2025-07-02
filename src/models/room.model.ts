import { model, Schema } from "mongoose";

type RoomType = {
  name: string;
  roomNo: number;
  capacity: number;
  materials: string[];
  imagePaths?: string[];
};

const roomSchema = new Schema<RoomType>(
  {
    name: { type: String, required: true },
    roomNo: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },
    materials: { type: [String], default: [] },
    imagePaths: { type: [String], default: [] },
  },
  { timestamps: true }
);

roomSchema.index({ roomNo: 1 }, { unique: true });

const Room = model<RoomType>("Room", roomSchema);

export { Room };
