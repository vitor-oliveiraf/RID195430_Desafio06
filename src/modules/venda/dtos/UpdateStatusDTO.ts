import { z } from "zod";

export const UpdateStatusSchema = z.object({
  status: z.enum(["pago", "cancelado", "reembolsado"]),
});

export const CancelarVendaSchema = z.object({
  motivo: z.string().min(1),
});

export const ReembolsarVendaSchema = z.object({
  motivo: z.string().min(1),
});

export type UpdateStatusDTO = z.infer<typeof UpdateStatusSchema>;
export type CancelarVendaDTO = z.infer<typeof CancelarVendaSchema>;
export type ReembolsarVendaDTO = z.infer<typeof ReembolsarVendaSchema>;
