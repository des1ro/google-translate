import { TranslatorApiError } from "../error/translatorApi.exceptions";
import { TranslatorAPI } from "../translatorAPI";
import dotenv from "dotenv";

dotenv.config();
// Tworzymy sztuczne dane uwierzytelniające do testów

describe("TranslatorAPI test suite", () => {
  let objectUnderTest: TranslatorAPI;
  const testValueOne = {
    text: "Hello world",
    lang: "es",
  };
  const testResultOne = "Hola Mundo";

  const CREDENTIALS = JSON.parse(process.env.CREDENTIALS!);

  beforeEach(() => {
    objectUnderTest = new TranslatorAPI(CREDENTIALS);
  });

  it("should create an instance of TranslatorAPI", () => {
    //Then
    expect(objectUnderTest).toBeInstanceOf(TranslatorAPI);
  });

  it("should translate text", async () => {
    //Given
    const translation = await objectUnderTest.translate(
      testValueOne.text,
      testValueOne.lang
    );
    //Then

    expect(translation).toBe(testResultOne);
  });
  it("should throw TranslatorApiError on API error", async () => {
    //Given
    const fakeCredentials = {
      client_email: "wrong email",
      private_key: "wrong private key",
    };
    const objectUnderTest = new TranslatorAPI(fakeCredentials); //Without credentials
    //Then
    await expect(
      objectUnderTest.translate(testValueOne.text, testValueOne.lang)
    ).rejects.toThrow(TranslatorApiError);
  });
});
