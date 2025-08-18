import { Router } from "express";
import { EstoqueController } from "../controllers/EstoqueController";
import { validateRequest } from "../../../shared/middlewares/validateRequest";
import { createEstoqueSchema } from "../schema/createEstoqueSchema";
import { updateEstoqueSchema } from "../schema/updateEstoqueSchema";

const router = Router();
const estoqueController = new EstoqueController();

// Rotas do produto
router.post(
  "/",
  validateRequest(createEstoqueSchema),
  estoqueController.create.bind(estoqueController)
);
router.get("/", estoqueController.findAll.bind(estoqueController));
router.get("/:id", estoqueController.findById.bind(estoqueController));
router.put(
  "/:id",
  validateRequest(updateEstoqueSchema),
  estoqueController.update.bind(estoqueController)
);
router.delete("/:id", estoqueController.delete.bind(estoqueController));

export default router;
