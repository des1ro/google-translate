import { Request, Response } from "express";
import { TranslatorService } from "../service/translator.service";
import data from "../../../data/pl.json";
import { JSONObject } from "../jsonObject.type";

export class TranslatorController {
  async translateIndex(req: Request, res: Response) {
    const translator = new TranslatorService();
    const lang: string = req.body.lang;

    const dateToTranslate: JSONObject = data.pl;
    const translatedData = await translator.getTranslatedObject(
      dateToTranslate,
      lang
    );
    res.status(200).send({ translatedData });
  }
  async translateIndexAndSave(req: Request, res: Response) {
    const translator = new TranslatorService();
    const lang: string = req.body.lang;

    const dateToTranslate: JSONObject = data.pl;
    const translatedData = await translator.translateAndSaveObject(
      dateToTranslate,
      lang
    );
    res.status(200).send({ translatedData });
  }
}
