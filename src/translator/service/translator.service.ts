import { Translate } from "@google-cloud/translate/build/src/v2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { JSONObject } from "../jsonObject.type";
dotenv.config();
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS!);

export class TranslatorService {
  async getTranslatedObject(text: JSONObject, lang: string) {
    const newText: JSONObject = await this.translateObject(text, lang);
    return newText;
  }
  async translateAndSaveObject(text: JSONObject, lang: string) {
    const obj = await this.getTranslatedObject(text, lang);
    const json = JSON.stringify(obj);
    fs.writeFile(
      path.join(process.cwd(), "cache/data.json"),
      json,
      "utf8",
      (err) => {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  }

  private async translateObject(
    obj: JSONObject,
    lang: string
  ): Promise<JSONObject> {
    const newObj: JSONObject = { ...obj };

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === "string" && key !== "action") {
          newObj[key] = await this.translateRecord(value, lang);
        } else if (typeof value === "object" && value !== null) {
          newObj[key] = await this.translateObject(value, lang);
        }
      }
    }
    return newObj;
  }

  private async translateRecord(text: string, lang: string) {
    const translate = new Translate({
      credentials: CREDENTIALS,
    });
    try {
      let [response] = await translate.translate(text, lang);
      return response;
    } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return;
    }
  }
}
