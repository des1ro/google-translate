import { FileService, pathway } from "../../fileService/fileService";
import { GoogleTranslate, credentials } from "../../googleApis/googleApis";
import { JSONObject } from "../model/jsonObject.type";

export class TranslatorService {
  constructor(
    private readonly translator: GoogleTranslate,
    private readonly fileService: FileService
  ) {}

  async translateAndSaveObject(
    objectToTranslate: JSONObject,
    lang: string
  ): Promise<void> {
    const translatedObj: JSONObject = await this.getTranslatedObject(
      objectToTranslate,
      lang
    );
    await this.fileService.writeJSONObject(translatedObj);
  }

  async getTranslatedObject(
    text: JSONObject,
    lang: string
  ): Promise<JSONObject> {
    const tranlatedString = await this.translator.translate(
      JSON.stringify(text),
      lang
    );
    const translatedObj: JSONObject = JSON.parse(tranlatedString);
    return translatedObj;
  }
}
