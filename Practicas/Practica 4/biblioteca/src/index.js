require("reflect-metadata");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const { AppDataSource } = require("./data-source");

async function startServer() {
  const app = express();

  // Inicializar la conexión con la base de datos
  await AppDataSource.initialize();
  console.log("✅ Conectado a la base de datos");

  // Crear el servidor Apollo
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  // Levantar Express
  app.listen(4000, () => {
    console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();
