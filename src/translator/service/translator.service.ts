import { FileService } from "../../fileService/fileService";
import { JSONObject } from "../model/jsonObject.type";
import { TranslatorSDK } from "../translator-sdk/translator-sdk";

export class TranslatorService {
  constructor(
    private readonly translatorSDK: TranslatorSDK,
    private readonly fileService: FileService
  ) {}

  async translateAndSaveObject<T>(
    objectToTranslate: JSONObject<T>,
    lang: string
  ): Promise<void> {
    const translatedObj: JSONObject<T> = await this.getTranslatedObject(
      objectToTranslate,
      lang
    );
    await this.fileService.writeJSONObject(translatedObj);
  }

  async getTranslatedObject<T>(
    text: JSONObject<T>,
    lang: string
  ): Promise<JSONObject<T>> {
    const translatedObj: JSONObject<T> = await this.translateObject(text, lang);
    return translatedObj;
  }

  private async translateRecord(text: string, lang: string): Promise<string> {
    return await this.translatorSDK.translate(text, lang);
  }

  private async translateObject<T>(
    object: JSONObject<T>,
    lang: string
  ): Promise<JSONObject<T>> {
    const newObj: JSONObject<T> = {};
    const dictionary: Record<
      string,
      (value: any, lang: string) => Promise<T | JSONObject<T>>
    > = {
      string: async (value: string, lang: string) =>
        (await this.translateRecord(value, lang)) as T,
      object: async (value: JSONObject<T>, lang: string) =>
        (await this.translateObject(value, lang)) as JSONObject<T>,
    };
    for (const key in object) {
      const value: T | JSONObject<T> = object[key];
      if (key !== "action") {
        const type = typeof value;
        if (dictionary[type]) {
          newObj[key] = await dictionary[type](value, lang);
        }
      }
    }
    return newObj;
  }
}
