import { z } from "zod";

// Schema para atualização de status
export const UpdateStatusSchema = z.object({
  status: z.enum(["pendente", "pago", "cancelado", "reembolsado"], {
    errorMap: () => ({
      message: "Status deve ser: pendente, pago, cancelado ou reembolsado",
    }),
  }),
});

// Schema para cancelamento
export const CancelarVendaSchema = z.object({
  motivo: z.string().min(1, "Motivo do cancelamento é obrigatório"),
});

// Schema para reembolso
export const ReembolsarVendaSchema = z.object({
  motivo: z.string().min(1, "Motivo do reembolso é obrigatório"),
});

// Tipos TypeScript
export type UpdateStatusDTO = z.infer<typeof UpdateStatusSchema>;
export type CancelarVendaDTO = z.infer<typeof CancelarVendaSchema>;
export type ReembolsarVendaDTO = z.infer<typeof ReembolsarVendaSchema>;
