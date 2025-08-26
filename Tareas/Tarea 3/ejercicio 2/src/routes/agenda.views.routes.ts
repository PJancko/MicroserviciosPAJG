import { Router } from "express";
import * as controller from "../controller/agenda.views.controller";

const router = Router();

router.get("/", controller.list);
router.get("/new", controller.showCreateForm);
router.post("/new", controller.create);
router.get("/edit/:id", controller.showEditForm);
router.post("/edit/:id", controller.update);
router.post("/delete/:id", controller.remove);

export default router;
