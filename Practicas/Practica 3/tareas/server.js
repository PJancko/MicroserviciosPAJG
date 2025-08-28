const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Tarea = require("./models/Tarea");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Conexión a MongoDB
mongoose.connect("mongodb://mongo_db:27017/tareasdb")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// Rutas
app.get("/", async (req, res) => {
  const tareas = await Tarea.find();
  res.render("index", { tareas });
});

app.get("/nuevo", (req, res) => {
  res.render("form");
});

app.post("/agregar", async (req, res) => {
  const { titulo, descripcion, estado } = req.body;
  await Tarea.create({ titulo, descripcion, estado });
  res.redirect("/");
});

app.get("/editar/:id", async (req, res) => {
  const tarea = await Tarea.findById(req.params.id);
  res.render("edit", { tarea });
});

app.post("/actualizar/:id", async (req, res) => {
  const { titulo, descripcion, estado } = req.body;
  await Tarea.findByIdAndUpdate(req.params.id, { titulo, descripcion, estado });
  res.redirect("/");
});

app.get("/eliminar/:id", async (req, res) => {
  await Tarea.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
