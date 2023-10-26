import { Request, Response } from "express";
import { TranslatorService } from "../service/translator.service";
import { JSONObject } from "../jsonObject.type";

export class TranslatorController {
  constructor(private readonly translateService = new TranslatorService()) {}

  async translate(req: Request, res: Response): Promise<void> {
    try {
      const lang = (req.query?.lang as string) || "en";
      const dateToTranslate: JSONObject = req.body?.data;
      if (!dateToTranslate) {
        res.status(400).send("Bad Request: Missing data");
        return;
      }

      const translatedData = await this.translateService.getTranslatedObject(
        dateToTranslate,
        lang
      );

      res.status(201).send(translatedData);
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
  }

  async translateAndSave(req: Request, res: Response): Promise<void> {
    try {
      const lang = req.query?.lang as string;
      const dateToTranslate: JSONObject = req.body?.data;
      if (!dateToTranslate) {
        res.status(400).send("Bad Request: Missing data");
        return;
      }

      await this.translateService.translateAndSaveObject(dateToTranslate, lang);
      res.status(204).send("Success");
    } catch (error) {
      res.status(500).send(`Error: ${error}`);
    }
  }
}
