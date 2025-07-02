import { UserType } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserType & { favorites?: import("mongoose").Types.ObjectId[] };
    }
  }
}
