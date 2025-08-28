const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Conexión MySQL
// Usamos un pool que reintenta conexiones
const db = mysql.createPool({
  host: "mysql_db",   // nombre del servicio en docker-compose
  user: "root",
  password: "root",
  database: "usuariosdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL!");
  connection.release();
});

// Rutas
app.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) throw err;
    res.render("index", { usuarios: results });
  });
});

app.get("/nuevo", (req, res) => {
  res.render("form");
});

app.post("/agregar", (req, res) => {
  const { nombre, correo } = req.body;
  db.query("INSERT INTO usuarios (nombre, correo, fecha_registro) VALUES (?, ?, NOW())",
    [nombre, correo],
    (err) => {
      if (err) throw err;
      res.redirect("/");
    });
});

app.get("/eliminar/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
