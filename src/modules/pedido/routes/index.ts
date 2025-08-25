import { Router } from "express";
import { PedidoController } from "../controllers/PedidoController";
import { CreatePedidoSimpleSchema } from "../dtos/CreatePedidoDTO";
import {
  UpdateStatusSchema,
  CancelarPedidoSchema,
} from "../dtos/UpdateStatusDTO";
import { validateRequest } from "../../../shared/middlewares/validateRequest";

const router = Router();
const pedidoController = new PedidoController();

// Rotas de pedidos
router.post(
  "/",
  validateRequest(CreatePedidoSimpleSchema),
  pedidoController.create.bind(pedidoController)
);

// Rotas de consulta
router.get("/", pedidoController.findAll.bind(pedidoController));

// Rotas específicas devem vir ANTES das rotas com parâmetros dinâmicos
router.get("/periodo", pedidoController.findByDateRange.bind(pedidoController));
router.get(
  "/estatisticas",
  pedidoController.getEstatisticas.bind(pedidoController)
);
router.get(
  "/estatisticas/por-status",
  pedidoController.getPedidosPorStatus.bind(pedidoController)
);
router.get(
  "/em-preparo",
  pedidoController.getPedidosEmPreparo.bind(pedidoController)
);

// Rotas com parâmetros dinâmicos devem vir DEPOIS das rotas específicas
router.get("/:id", pedidoController.findById.bind(pedidoController));
router.get(
  "/cliente/:clienteId",
  pedidoController.findByClienteId.bind(pedidoController)
);
router.get(
  "/status/:status",
  pedidoController.findByStatus.bind(pedidoController)
);
router.get(
  "/produto/:produtoId",
  pedidoController.findByProduto.bind(pedidoController)
);

// Rotas de atualização
router.patch(
  "/:id/status",
  validateRequest(UpdateStatusSchema),
  pedidoController.updateStatus.bind(pedidoController)
);
router.patch(
  "/:id/cancelar",
  validateRequest(CancelarPedidoSchema),
  pedidoController.cancelarPedido.bind(pedidoController)
);

export default router;
