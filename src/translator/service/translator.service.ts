import fs from "fs";
import path from "path";
import { JSONObject } from "../jsonObject.type";
import { TranslatorAPI } from "../../utils/googleTranslatorApi/translatorAPI";
import { TranslatorError } from "../error/translator.exceptions";

export class TranslatorService {
  constructor(private readonly translatorApi = new TranslatorAPI()) {}
  async translateAndSaveObject(objectToTranslate: JSONObject, lang: string) {
    const translatedObj: JSONObject = await this.getTranslatedObject(
      objectToTranslate,
      lang
    );
    const pathway = path.join(process.cwd(), "cache/data.json");
    fs.writeFile(pathway, JSON.stringify(translatedObj), "utf8", (error) => {
      if (error) {
        throw new TranslatorError({
          name: "WRITING_ERROR",
          message: `Error during translation: ${error}`,
        });
      } else {
        console.log(`Success: Object saved in: ${pathway}`);
      }
    });
  }
  async getTranslatedObject(text: JSONObject, lang: string) {
    const translatedObj: JSONObject = await this.translateObject(text, lang);
    return translatedObj;
  }
  private async translateRecord(text: string, lang: string): Promise<string> {
    return await this.translatorApi.translate(text, lang);
  }

  private async translateObject(
    object: JSONObject,
    lang: string
  ): Promise<JSONObject> {
    const newObj: JSONObject = {};
    const dictionary = this.getDictionary();
    for (const key in object) {
      const value: string | JSONObject = object[key];
      if (key !== "action") {
        const type = typeof value;
        newObj[key] = await dictionary[type](value, lang);
      }
    }
    return newObj;
  }
  private getDictionary() {
    const dictionary: Record<
      string,
      (value: any, lang: string) => Promise<JSONObject | string>
    > = {
      string: async (value: string, lang) =>
        await this.translateRecord(value, lang),
      object: async (value: JSONObject, lang) =>
        await this.translateObject(value, lang),
    };
    return dictionary;
  }
}
