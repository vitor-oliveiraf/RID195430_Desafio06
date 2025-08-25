import { Router } from "express";
import { VendaController } from "../controllers/VendaController";
import {
  CreateVendaSchema,
  CreateVendaFromPedidoSchema,
} from "../dtos/CreateVendaDTO";
import {
  UpdateStatusSchema,
  CancelarVendaSchema,
  ReembolsarVendaSchema,
} from "../dtos/UpdateStatusDTO";
import { validateRequest } from "../../../shared/middlewares/validateRequest";

const router = Router();
const vendaController = new VendaController();

// Rotas de vendas
router.post(
  "/",
  validateRequest(CreateVendaSchema),
  vendaController.create.bind(vendaController)
);

// Rota para criar venda a partir de um pedido
router.post(
  "/from-pedido",
  validateRequest(CreateVendaFromPedidoSchema),
  vendaController.createFromPedido.bind(vendaController)
);

// Rotas de consulta
router.get("/", vendaController.findAll.bind(vendaController));

// Rotas específicas devem vir ANTES das rotas com parâmetros dinâmicos
router.get("/periodo", vendaController.findByDateRange.bind(vendaController));

// Rotas com parâmetros dinâmicos devem vir DEPOIS das rotas específicas
router.get("/:id", vendaController.findById.bind(vendaController));
router.get(
  "/cliente/:clienteId",
  vendaController.findByClienteId.bind(vendaController)
);
router.get(
  "/pedido/:pedidoId",
  vendaController.findByPedidoId.bind(vendaController)
);
router.get(
  "/status/:status",
  vendaController.findByStatus.bind(vendaController)
);
router.get(
  "/produto/:produtoId",
  vendaController.findByProduto.bind(vendaController)
);

// Rotas de atualização de status
router.patch(
  "/:id/status",
  validateRequest(UpdateStatusSchema),
  vendaController.updateStatus.bind(vendaController)
);
router.patch(
  "/:id/cancelar",
  validateRequest(CancelarVendaSchema),
  vendaController.cancelarVenda.bind(vendaController)
);
router.patch(
  "/:id/reembolsar",
  validateRequest(ReembolsarVendaSchema),
  vendaController.reembolsarVenda.bind(vendaController)
);

export default router;
