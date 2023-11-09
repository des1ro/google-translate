type ErrorName = "TRANSLATE_ERROR";
//translator-api.exception.ts
export class TranslatorSdkError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}
