import express from "express";
import cors from "cors";
import productosRoutes from "./routes/productos.js";
import clientesRoutes from "./routes/clientes.js";
import facturasRoutes from "./routes/facturas.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/productos", productosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/facturas", facturasRoutes);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});
