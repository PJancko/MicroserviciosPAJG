import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sistema de Ventas",
      version: "1.0.0",
      description: "Documentación de la API RESTful para la gestión de productos",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.js"], // Aquí buscará las anotaciones
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
