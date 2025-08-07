import express from "express";
import { AppDataSource } from "./data-source";
import { Agenda } from "./entity/Agenda";
import bodyParser from "body-parser";
import path from "path";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

AppDataSource.initialize().then(() => {
  const repo = AppDataSource.getRepository(Agenda);

  // 🟢 LISTAR
  app.get("/agenda", async (req, res) => {
    const agenda = await repo.find();
    res.render("agenda", { agenda });
  });

  // 🟡 FORMULARIO NUEVO
  app.get("/agenda/new", (req, res) => {
    res.render("form", { agenda: null });
  });

  // 🟡 CREAR NUEVO
  app.post("/agenda/new", async (req, res) => {
    const nueva = repo.create(req.body);
    await repo.save(nueva);
    res.redirect("/agenda");
  });

  // 🟠 FORMULARIO EDITAR
  app.get("/agenda/edit/:id", async (req, res) => {
    const agenda = await repo.findOneBy({ id: parseInt(req.params.id) });
    res.render("form", { agenda });
  });

  // 🟠 EDITAR
  app.post("/agenda/edit/:id", async (req, res) => {
    const agenda = await repo.findOneBy({ id: parseInt(req.params.id) });
    repo.merge(agenda!, req.body);
    await repo.save(agenda!);
    res.redirect("/agenda");
  });

  // 🔴 ELIMINAR
  app.post("/agenda/delete/:id", async (req, res) => {
    await repo.delete(req.params.id);
    res.redirect("/agenda");
  });

  app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
  });
});
