import { GoogleAuth } from "google-auth-library";
import { google, translate_v2 } from "googleapis";
import path from "path";
import { GoogleTranslateError } from "./error/google.translator.excepitons";
export const key = path.join(
  process.cwd(),
  "/src/googleApis/the-tokenizer-399807-68a00448b2b6.json"
);

const textToTranslate = ["Hello World", "my name is jeff"];
const lang = "pl";

export class GoogleTranslate {
  private readonly auth: GoogleAuth;
  private readonly client: translate_v2.Translate;
  constructor(private readonly accessKey: string) {
    this.auth = new google.auth.GoogleAuth({
      keyFile: accessKey,
      scopes: "https://www.googleapis.com/auth/cloud-translation",
    });
    this.client = google.translate({
      version: "v2",
      auth: this.auth,
    });
  }
  async translate(text: string[], lang: string) {
    try {
      const response = (await this.client.translations.list({
        q: text,
        target: lang,
      })) as any;
      const translatedText = response.data
        .data as translate_v2.Schema$TranslationsListResponse;
      if (translatedText.translations) {
        return translatedText.translations[0].translatedText;
      }
      throw new GoogleTranslateError(
        "TRANSLATION_ERROR",
        "Error during translation"
      );
    } catch (error) {
      throw new GoogleTranslateError("TRANSLATION_ERROR", ` Cause: ${error}`);
    }
  }
}

const abs = new GoogleTranslate(key);
const res = async () => {
  console.log(await abs.translate(textToTranslate, lang));
};
res();
