import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController";
import { validateRequest } from "../../../shared/middlewares/validateRequest";
import { createProdutoSchema } from "../schema/createProdutoSchema";
import { updateProdutoSchema } from "../schema/updateProdutoSchema";

const router = Router();
const produtoController = new ProdutoController();

// Rotas do produto
router.post(
  "/",
  validateRequest(createProdutoSchema),
  produtoController.create.bind(produtoController)
);
router.get("/", produtoController.findAll.bind(produtoController));
router.get("/:id", produtoController.findById.bind(produtoController));
router.get("/nome/:nome", produtoController.findByNome.bind(produtoController));
router.put(
  "/:id",
  validateRequest(updateProdutoSchema),
  produtoController.update.bind(produtoController)
);
router.delete("/:id", produtoController.delete.bind(produtoController));

export default router;
