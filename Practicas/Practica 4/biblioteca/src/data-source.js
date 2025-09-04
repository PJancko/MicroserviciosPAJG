const { DataSource } = require("typeorm");
const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "graphql_biblioteca", // ⚠️ usa otra BD distinta
  synchronize: true,
  logging: false,
  entities: [Libro, Prestamo],
});

module.exports = { AppDataSource };
