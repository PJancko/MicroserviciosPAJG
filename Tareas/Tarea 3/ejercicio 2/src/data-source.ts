import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agenda } from "./entity/Agenda";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/agendas";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: MONGO_URI,
  synchronize: true,
  logging: false,
  entities: [Agenda],
});
