import { Router } from "express";
import usuarioRoutes from "../modules/usuario/routes";
import produtoRoutes from "../modules/produtos/routes";
import estoqueRoutes from "../modules/estoque/routes";
import vendaRoutes from "../modules/venda/routes";
import pedidoRoutes from "../modules/pedido/routes";

const router = Router();

// Rotas dos módulos
router.use("/usuarios", usuarioRoutes);
router.use("/produtos", produtoRoutes);
router.use("/estoque", estoqueRoutes);
router.use("/vendas", vendaRoutes);
router.use("/pedidos", pedidoRoutes);

// Rota de teste
router.get("/", (req, res) => {
  res.json({ message: "API DNC Store Manager funcionando!" });
});

export default router;
