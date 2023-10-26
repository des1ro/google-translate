import { Request, Response, Router } from "express";
import { TranslatorController } from "./controller/translator.controller";
const routes = Router();
const translator = new TranslatorController();
routes.post("/translate/:lang?", async (req: Request, res: Response) => {
  translator.translate(req, res);
});
routes.post("/translateAndSave/:lang?", async (req: Request, res: Response) => {
  translator.translateAndSave(req, res);
});

export default routes;
