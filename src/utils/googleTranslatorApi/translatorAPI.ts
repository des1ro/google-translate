import { Translate } from "@google-cloud/translate/build/src/v2";
import dotenv from "dotenv";
import { TranslatorApiError } from "./error/translatorApi.exceptions";
import { CredentialBody } from "google-auth-library/build/src/auth/credentials";
import { ExternalAccountClientOptions } from "google-auth-library/build/src/auth/externalclient";
dotenv.config();
let CREDENTIALS: CredentialBody | ExternalAccountClientOptions | undefined;
if (process.env.CREDENTIALS) {
  CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
}
export class TranslatorAPI {
  translator: Translate;
  constructor(private readonly credentials = CREDENTIALS) {
    this.translator = new Translate({
      credentials: this.credentials,
    });
  }
  async translate(text: string, lang: string): Promise<string> {
    try {
      const [value] = await this.translator.translate(text, lang);
      return value;
    } catch (error) {
      throw new TranslatorApiError({
        name: "API_ERROR",
        message: `Error during translation ${error}`,
      });
    }
  }
}
