import { Router } from "express";
import { VendaController } from "../controllers/VendaController";
import { CreateVendaSchema } from "../dtos/CreateVendaDTO";
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

// Rotas de consulta
router.get("/", vendaController.findAll.bind(vendaController));
router.get("/:id", vendaController.findById.bind(vendaController));
router.get(
  "/cliente/:clienteId",
  vendaController.findByClienteId.bind(vendaController)
);
router.get(
  "/vendedor/:vendedorId",
  vendaController.findByVendedorId.bind(vendaController)
);
router.get(
  "/status/:status",
  vendaController.findByStatus.bind(vendaController)
);
router.get(
  "/produto/:produtoId",
  vendaController.findByProduto.bind(vendaController)
);

// Rotas de período
router.get("/periodo", vendaController.findByDateRange.bind(vendaController));

// Rotas de estatísticas
router.get(
  "/estatisticas",
  vendaController.getEstatisticas.bind(vendaController)
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
