import express from "express";
import { AppDataSource } from "./data-source";
import bodyParser from "body-parser";
import path from "path";

// Routers
import agendaApiRoutes from "./routes/agenda.routes";
import agendaViewRoutes from "./routes/agenda.views.routes";

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Conexión DB
AppDataSource.initialize().then(() => {
  console.log("✅ Base de datos conectada");

  // Montar rutas
  app.use("/api/agenda", agendaApiRoutes);
  app.use("/agenda", agendaViewRoutes);

  // Servidor
  app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
  });
}).catch(err => {
  console.error("❌ Error al conectar la base de datos", err);
});
