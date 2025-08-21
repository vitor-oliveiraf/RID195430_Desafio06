import { z } from "zod";

// Schema para atualização de status
export const UpdateStatusSchema = z.object({
  status: z.enum(
    [
      "recebido",
      "confirmado",
      "preparando",
      "pronto",
      "em_entrega",
      "entregue",
      "cancelado",
    ],
    {
      errorMap: () => ({
        message:
          "Status deve ser: recebido, confirmado, preparando, pronto, em_entrega, entregue ou cancelado",
      }),
    }
  ),
});

// Schema para cancelamento
export const CancelarPedidoSchema = z.object({
  motivo: z.string().min(1, "Motivo do cancelamento é obrigatório"),
});

// Schema para atualização de tempo estimado
export const UpdateTempoEstimadoSchema = z.object({
  tempoEstimado: z.number().positive("Tempo estimado deve ser positivo"),
});

// Tipos TypeScript
export type UpdateStatusDTO = z.infer<typeof UpdateStatusSchema>;
export type CancelarPedidoDTO = z.infer<typeof CancelarPedidoSchema>;
export type UpdateTempoEstimadoDTO = z.infer<typeof UpdateTempoEstimadoSchema>;
