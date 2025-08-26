import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Agenda } from "../entity/Agenda";
import { ObjectId } from "mongodb"; // ✅ Import correcto

const repo = AppDataSource.getMongoRepository(Agenda);

// Función simple para validar ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

// Listar todos los contactos
export const list = async (_: Request, res: Response) => {
    const agenda = await repo.find();
    res.render("agenda", { agenda });
};

// Mostrar formulario para crear nuevo contacto
export const showCreateForm = (_: Request, res: Response) => {
    res.render("form", { agenda: null });
};

// Crear un nuevo contacto
export const create = async (req: Request, res: Response) => {
    const nueva = repo.create(req.body);
    await repo.save(nueva);
    res.redirect("/agenda");
};

// Mostrar formulario para editar contacto
export const showEditForm = async (req: Request, res: Response) => {
    const idStr = req.params.id;
    if (!isValidObjectId(idStr)) return res.status(400).send("ID inválido");

    const agenda = await repo.findOneBy({ _id: new ObjectId(idStr) });
    if (!agenda) return res.status(404).send("Contacto no encontrado");

    res.render("form", { agenda });
};

// Actualizar contacto existente
export const update = async (req: Request, res: Response) => {
    const idStr = req.params.id;
    if (!isValidObjectId(idStr)) return res.status(400).send("ID inválido");

    const id = new ObjectId(idStr);
    const agenda = await repo.findOneBy({ _id: id });
    if (!agenda) return res.status(404).send("Contacto no encontrado");

    repo.merge(agenda, req.body);
    await repo.save(agenda);
    res.redirect("/agenda");
};

// Eliminar contacto
export const remove = async (req: Request, res: Response) => {
    const idStr = req.params.id;
    if (!isValidObjectId(idStr)) return res.status(400).send("ID inválido");

    const id = new ObjectId(idStr);
    const result = await repo.delete(id);
    if (result.affected === 0) return res.status(404).send("Contacto no encontrado");

    res.redirect("/agenda");
};
