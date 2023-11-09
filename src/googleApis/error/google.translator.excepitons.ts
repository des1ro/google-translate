type ErrorName = "TRANSLATION_ERROR";
export class GoogleTranslateError extends Error {
  name: string;
  message: string;
  constructor(name: ErrorName, message: string) {
    super(name);
    this.name = name;
    this.message = message;
  }
}
