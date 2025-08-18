import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  // Captura erros de parsing JSON
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return response.status(400).json({
      status: "error",
      message: "JSON inválido. Verifique a sintaxe da requisição.",
    });
  }

  console.error("Erro não tratado:", error);

  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
