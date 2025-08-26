import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agenda } from "./entity/Agenda";

export const AppDataSource = new DataSource({
    type: "mongodb", // 👈 cambiamos de mysql a mongodb
    host: "localhost",
    port: 27017,
    database: "agenda_db",
    synchronize: true, // ⚠️ auto sync, útil en desarrollo
    logging: false,
    entities: [Agenda],
});
