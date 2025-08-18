import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { response } from "../utils/response";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida apenas o body da requisição
      const validatedData = await schema.parseAsync(req.body);

      // Atualiza o body com os dados validados e transformados
      req.body = validatedData;

      return next();
    } catch (error: any) {
      // const errorMessage = error.errors?.[0]?.message || "Dados inválidos";
      // return response(res, 400, errorMessage);

      if (error.errors && error.errors.length > 0) {
        const firstError = error.errors[0];
        const fieldName = firstError.path.join(".");
        const errorMessage = `${fieldName}: ${firstError.message}`;
        return response(res, 400, errorMessage);
      }
      return response(res, 400, "Dados inválidos");
    }
  };
};
