import dotenv from "dotenv";
import { CredentialBody, GoogleAuth } from "google-auth-library";
import { google, translate_v2 } from "googleapis";
import { GoogleTranslateError } from "./error/google.translator.excepitons";
dotenv.config();

export const credentials = {
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
};
export class GoogleTranslate {
  private readonly auth: GoogleAuth;
  private readonly client: translate_v2.Translate;
  constructor(private readonly credentials: CredentialBody) {
    this.auth = new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: process.env.SCOPE,
    });
    this.client = google.translate({
      version: process.env.VERSION as "v2",
      auth: this.auth,
    });
  }
  async translate(text: string, lang: string): Promise<string> {
    try {
      const response = (await this.client.translations.list({
        q: [text],
        target: lang,
        format: process.env.FORMAT,
      })) as any;
      const translatedText = response.data
        .data as translate_v2.Schema$TranslationsListResponse;
      if (
        translatedText.translations &&
        translatedText.translations[0].translatedText
      ) {
        return translatedText.translations[0].translatedText;
      }
      throw new GoogleTranslateError({
        name: "TRANSLATION_ERROR",
        message: `There is no translation to return`,
      });
    } catch (error) {
      throw new GoogleTranslateError({
        name: "TRANSLATION_ERROR",
        message: `Cause: ${error}`,
      });
    }
  }
}
