import { Router, Request, Response } from "express";
import { FileService, pathway } from "../fileService/fileService";
import { GoogleTranslate, credentials } from "../googleApis/googleApis";
import { TranslatorController } from "./controller/translator.controller";
import { TranslatorService } from "./service/translator.service";
const routes = Router();
const translateApi = new GoogleTranslate(credentials);
const fileService = new FileService(pathway);
const translatorService = new TranslatorService(translateApi, fileService);
const translatorController = new TranslatorController(translatorService);
routes.post("/translate", async (req: Request, res: Response) => {
  await translatorController.translate(req, res);
});
routes.post("/translateAndSave", async (req: Request, res: Response) => {
  await translatorController.translateAndSave(req, res);
});
export default routes;
