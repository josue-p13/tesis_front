import { MongoClient, Db } from "mongodb";

const options = {};

let clientPromise: Promise<MongoClient> | null = null;

// Helper para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  const uri = process.env.MONGODB_URI || "";
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  if (process.env.NODE_ENV === "development") {
    // En desarrollo, usar una variable global para preservar el cliente
    // a través de hot-reloads de Next.js
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // En producción, crear un nuevo cliente si no existe
    if (!clientPromise) {
      const client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  }

  const client = await clientPromise;
  return client.db(); // Usa el nombre de DB del connection string
}

// Nombres de colecciones
export const COLLECTIONS = {
  USERS: "users",
} as const;
