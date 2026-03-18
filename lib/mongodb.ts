import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

if (!uri && process.env.NODE_ENV !== "development") {
  console.warn('Warning: Missing environment variable: "MONGODB_URI"');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usar una variable global para preservar el cliente
  // a través de hot-reloads de Next.js
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
    }
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // En producción, crear un nuevo cliente
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Helper para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(); // Usa el nombre de DB del connection string
}

// Nombres de colecciones
export const COLLECTIONS = {
  USERS: "users",
} as const;

export default clientPromise;
