import { Request, Response } from "express";
import { TranslatorService } from "../service/translator.service";
import { JSONObject } from "../model/jsonObject.type";

export class TranslatorController {
  constructor(private readonly translateService: TranslatorService) {}

  async translate<T>(req: Request, res: Response): Promise<void> {
    try {
      const lang = req.body.lang;
      const dateToTranslate: JSONObject<T> = req.body.data;
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

  async translateAndSave<T>(req: Request, res: Response): Promise<void> {
    try {
      const lang = req.body.lang;
      const dateToTranslate: JSONObject<T> = req.body.data;
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
