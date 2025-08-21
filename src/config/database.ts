import mongoose from "mongoose";

export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("MongoDB já está conectado");
      return;
    }

    try {
      const mongoUri =
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/dnc_store_manager";

      await mongoose.connect(mongoUri);

      this.isConnected = true;
      console.log("✅ MongoDB conectado com sucesso");

      // Configurar listeners de eventos
      mongoose.connection.on("error", (error) => {
        console.error("❌ Erro na conexão MongoDB:", error);
        this.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        console.log("🔌 MongoDB desconectado");
        this.isConnected = false;
      });
    } catch (error) {
      console.error("❌ Erro ao conectar com MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("🔌 MongoDB desconectado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao desconectar MongoDB:", error);
      throw error;
    }
  }

  public isConnectedToMongo(): boolean {
    return this.isConnected;
  }
}

export const mongoConnection = MongoDBConnection.getInstance();
