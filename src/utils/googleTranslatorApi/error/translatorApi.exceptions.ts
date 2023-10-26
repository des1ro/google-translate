type ErrorName = "API_ERROR";
export class TranslatorApiError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}
