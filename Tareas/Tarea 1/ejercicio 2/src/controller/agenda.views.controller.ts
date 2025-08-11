import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Agenda } from "../entity/Agenda";

const repo = AppDataSource.getRepository(Agenda);

export const list = async (_: Request, res: Response) => {
    const agenda = await repo.find();
    res.render("agenda", { agenda });
};

export const showCreateForm = (_: Request, res: Response) => {
    res.render("form", { agenda: null });
};

export const create = async (req: Request, res: Response) => {
    const nueva = repo.create(req.body);
    await repo.save(nueva);
    res.redirect("/agenda");
};

export const showEditForm = async (req: Request, res: Response) => {
    const agenda = await repo.findOneBy({ id: parseInt(req.params.id) });
    res.render("form", { agenda });
};

export const update = async (req: Request, res: Response) => {
    const agenda = await repo.findOneBy({ id: parseInt(req.params.id) });
    repo.merge(agenda!, req.body);
    await repo.save(agenda!);
    res.redirect("/agenda");
};

export const remove = async (req: Request, res: Response) => {
    await repo.delete(req.params.id);
    res.redirect("/agenda");
};
