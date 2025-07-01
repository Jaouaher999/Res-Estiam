import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: S3_BUCKET_NAME,
    key: function (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) {
      const ext = file.originalname.split(".").pop();
      const key = `rooms/${Date.now()}.${ext}`;
      cb(null, key);
    },
  }),
});
