import { z } from "zod";

export const UpdateStatusSchema = z.object({
  status: z.enum([
    "recebido",
    "confirmado",
    "preparando",
    "pronto",
    "entregue",
    "cancelado",
  ]),
});

export const CancelarPedidoSchema = z.object({
  motivo: z.string().min(1),
});

export type UpdateStatusDTO = z.infer<typeof UpdateStatusSchema>;
export type CancelarPedidoDTO = z.infer<typeof CancelarPedidoSchema>;
