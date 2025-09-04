require("reflect-metadata");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const { AppDataSource } = require("./data-source");

async function startServer() {
  const app = express();

  // Conectar a la BD antes de levantar el servidor
  await AppDataSource.initialize();
  console.log("✅ Conectado a la base de datos");

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();
