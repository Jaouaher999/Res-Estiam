import { Request, Response } from "express";
import { errorResponse } from "../utils/responseHandler";

export const notFoundHandler = (req: Request, res: Response) => {
  return errorResponse(res, "Not Found", [], 404);
};
