import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Agenda } from "../entity/Agenda";
import { ObjectId } from "typeorm";

const repo = AppDataSource.getMongoRepository(Agenda); // MongoRepository para MongoDB

export const getAll = async (_: Request, res: Response) => {
    try {
        const datos = await repo.find();
        res.json(datos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener datos", detalle: err });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const item = await repo.findOneBy({ _id: new ObjectId(req.params.id) });
        item ? res.json(item) : res.status(404).json({ error: "No encontrado" });
    } catch (err) {
        res.status(400).json({ error: "ID inválido", detalle: err });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const nuevo = repo.create(req.body);
        const result = await repo.save(nuevo);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: "Error al crear registro", detalle: err });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const id = new ObjectId(req.params.id);
        await repo.update(id, req.body);
        const actualizado = await repo.findOneBy({ _id: id });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ error: "Error al actualizar", detalle: err });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const id = new ObjectId(req.params.id);
        await repo.delete(id);
        res.json({ mensaje: "Eliminado correctamente" });
    } catch (err) {
        res.status(400).json({ error: "Error al eliminar", detalle: err });
    }
};
