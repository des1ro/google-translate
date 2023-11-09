import { Translate } from "@google-cloud/translate/build/src/v2";
import dotenv from "dotenv";
import { TranslatorSdkError } from "./error/translator-sdk.exceptions";
import { CredentialBody } from "google-auth-library";
dotenv.config();

export const GOOGLE_TRANSLATE_CREDENTIALS = JSON.parse(
  process.env.GOOGLE_TRANSLATE_CREDENTIALS!
);

// uzyc rest
export class TranslatorSDK {
  private readonly translator: Translate;
  constructor(private readonly credentials: CredentialBody) {
    this.translator = new Translate({
      credentials: this.credentials,
    });
  }
  async translate(text: string, lang: string): Promise<string> {
    try {
      const [value] = await this.translator.translate(text, lang);
      return value;
    } catch (error) {
      throw new TranslatorSdkError({
        name: "TRANSLATE_ERROR",
        message: `Error during translation ${error}`,
      });
    }
  }
}
