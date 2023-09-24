import { Request, Response, Router } from "express";
import { TranslatorController } from "./controller/translator.controller";
const routes = Router();
routes.post("/", async (req: Request, res: Response) => {
  const translator = new TranslatorController();
  translator.translateIndexAndSave(req, res);
});
routes.post("/cache");
export default routes;
