import { DataSource } from "typeorm";
import { entities } from "./entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "test.db", // Adjust database name
  synchronize: true, // Set to false in production for safety
  logging: false, // Set to true for debugging
  entities: entities, // Include your entities here
});