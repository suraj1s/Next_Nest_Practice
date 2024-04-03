import { DataSource } from "typeorm";
import { entities } from "./entity";

const mongoUrl = process.env.MONGO_URL; // Get URL from environment variable
if (!mongoUrl) {
  throw new Error("Missing MONGO_URL environment variable");
}

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: mongoUrl,
  synchronize: false, // Set to false for safety
  logging: false, // Set to true for debugging
  entities: entities, // Include your entities here
});