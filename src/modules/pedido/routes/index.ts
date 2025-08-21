import { Router } from "express";
import { PedidoController } from "../controllers/PedidoController";
import { CreatePedidoSchema } from "../dtos/CreatePedidoDTO";
import {
  UpdateStatusSchema,
  CancelarPedidoSchema,
  UpdateTempoEstimadoSchema,
} from "../dtos/UpdateStatusDTO";
import { validateRequest } from "../../../shared/middlewares/validateRequest";

const router = Router();
const pedidoController = new PedidoController();

// Rotas de pedidos
router.post(
  "/",
  validateRequest(CreatePedidoSchema),
  pedidoController.create.bind(pedidoController)
);

// Rotas de consulta
router.get("/", pedidoController.findAll.bind(pedidoController));
router.get("/:id", pedidoController.findById.bind(pedidoController));
router.get(
  "/cliente/:clienteId",
  pedidoController.findByClienteId.bind(pedidoController)
);
router.get(
  "/vendedor/:vendedorId",
  pedidoController.findByVendedorId.bind(pedidoController)
);
router.get(
  "/status/:status",
  pedidoController.findByStatus.bind(pedidoController)
);
router.get(
  "/tipo-entrega/:tipoEntrega",
  pedidoController.findByTipoEntrega.bind(pedidoController)
);
router.get(
  "/produto/:produtoId",
  pedidoController.findByProduto.bind(pedidoController)
);

// Rotas de período
router.get("/periodo", pedidoController.findByDateRange.bind(pedidoController));

// Rotas de estatísticas
router.get(
  "/estatisticas",
  pedidoController.getEstatisticas.bind(pedidoController)
);
router.get(
  "/estatisticas/por-status",
  pedidoController.getPedidosPorStatus.bind(pedidoController)
);

// Rotas de operações especiais
router.get(
  "/urgentes",
  pedidoController.getPedidosUrgentes.bind(pedidoController)
);
router.get(
  "/em-preparo",
  pedidoController.getPedidosEmPreparo.bind(pedidoController)
);

// Rotas de atualização
router.patch(
  "/:id/status",
  validateRequest(UpdateStatusSchema),
  pedidoController.updateStatus.bind(pedidoController)
);
router.patch(
  "/:id/tempo-estimado",
  validateRequest(UpdateTempoEstimadoSchema),
  pedidoController.updateTempoEstimado.bind(pedidoController)
);
router.patch(
  "/:id/cancelar",
  validateRequest(CancelarPedidoSchema),
  pedidoController.cancelarPedido.bind(pedidoController)
);

export default router;
