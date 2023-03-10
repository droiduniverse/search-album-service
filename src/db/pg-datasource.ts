import { DataSource } from "typeorm";
import { Request } from "../entities/Request";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.USERDB,
  password: process.env.DBPASS,
  database: process.env.DB_NAME,
  entities: [
    Request
  ],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
