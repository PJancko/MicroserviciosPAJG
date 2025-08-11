import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Agenda } from "../entity/Agenda";

const repo = AppDataSource.getRepository(Agenda);

export const getAll = async (_: Request, res: Response) => {
    const datos = await repo.find();
    res.json(datos);
};

export const getOne = async (req: Request, res: Response) => {
    const item = await repo.findOneBy({ id: +req.params.id });
    item ? res.json(item) : res.status(404).json({ error: "No encontrado" });
};

export const create = async (req: Request, res: Response) => {
    const nuevo = repo.create(req.body);
    const result = await repo.save(nuevo);
    res.json(result);
};

export const update = async (req: Request, res: Response) => {
    await repo.update(req.params.id, req.body);
    const actualizado = await repo.findOneBy({ id: +req.params.id });
    res.json(actualizado);
};

export const remove = async (req: Request, res: Response) => {
    await repo.delete(req.params.id);
    res.json({ mensaje: "Eliminado correctamente" });
};
