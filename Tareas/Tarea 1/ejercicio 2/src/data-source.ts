import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agenda } from "./entity/Agenda";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "", // Cambia si tienes clave
    database: "agenda_db",
    synchronize: true,
    logging: false,
    entities: [Agenda],
});
