import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import routes from "./routes";
import { errorHandler } from "./shared/middlewares/errorHandler";
import { mongoConnection } from "./config/database";
import "dotenv/config";

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", routes);

// Health check
app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Tratamento de erros global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Inicializar conexões com bancos de dados
async function initializeApp() {
  try {
    // Conectar com MongoDB
    await mongoConnection.connect();

    // Conectar com PostgreSQL (Prisma)
    await prisma.$connect();
    console.log("✅ PostgreSQL conectado com sucesso");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log("📊 Banco de dados: PostgreSQL + MongoDB");
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar aplicação:", error);
    process.exit(1);
  }
}

// Inicializar aplicação
initializeApp();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando aplicação...");
  await prisma.$disconnect();
  await mongoConnection.disconnect();
  process.exit(0);
});

export { app, prisma };
