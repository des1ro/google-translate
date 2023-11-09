import { Request, Response, Router } from "express";
import { TranslatorController } from "./controller/translator.controller";
import { TranslatorService } from "./service/translator.service";
import {
  GOOGLE_TRANSLATE_CREDENTIALS,
  TranslatorSDK,
} from "./translator-sdk/translator-sdk";
import { FileService } from "../fileService/fileService";
import { pathway } from "../fileService/fileService";
const routes = Router();
const translatorService = new TranslatorService(
  new TranslatorSDK(GOOGLE_TRANSLATE_CREDENTIALS),
  new FileService(pathway)
);
const translatorController = new TranslatorController(translatorService);
routes.post("/translate/:lang", async (req: Request, res: Response) => {
  translatorController.translate(req, res);
});
routes.post("/translateAndSave/:lang", async (req: Request, res: Response) => {
  translatorController.translateAndSave(req, res);
});

export default routes;
