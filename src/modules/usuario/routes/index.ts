import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { createUsuarioSchema, updateUsuarioSchema } from "../schema";
import { validateRequest } from "../../../shared/middlewares/validateRequest";

const router = Router();
const usuarioController = new UsuarioController();

// Rotas do usuário
router.post(
  "/",
  validateRequest(createUsuarioSchema),
  usuarioController.create.bind(usuarioController)
);
router.get("/", usuarioController.findAll.bind(usuarioController));
router.get("/:id", usuarioController.findById.bind(usuarioController));
router.get(
  "/email/:email",
  usuarioController.findByEmail.bind(usuarioController)
);
router.put(
  "/:id",
  validateRequest(updateUsuarioSchema),
  usuarioController.update.bind(usuarioController)
);
router.delete("/:id", usuarioController.delete.bind(usuarioController));

export default router;
