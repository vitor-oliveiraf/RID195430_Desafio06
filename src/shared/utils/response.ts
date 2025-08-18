import { Response } from "express";

export function response(
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) {
  return res.status(statusCode).json({
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
    message,
    data,
  });
}
