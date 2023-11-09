import { TranslatorSdkError } from "../error/translator-sdk.exceptions";
import { GOOGLE_TRANSLATE_CREDENTIALS, TranslatorSDK } from "../translator-sdk";

describe("TranslatorSDK test suite", () => {
  let objectUnderTest: TranslatorSDK;
  const testValueOne = {
    text: "Hello world",
    lang: "es",
  };
  const testResultOne = "Hola Mundo";

  beforeEach(() => {
    objectUnderTest = new TranslatorSDK(GOOGLE_TRANSLATE_CREDENTIALS);
  });

  it("should create an instance of TranslatorSDK", () => {
    //Then
    expect(objectUnderTest).toBeInstanceOf(TranslatorSDK);
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
  it("should throw TranslatorSdkError when given wrong credentials", async () => {
    //Given
    const fakeCredentials = {
      client_email: "wrong email",
      private_key: "wrong private key",
    };
    const objectUnderTest = new TranslatorSDK(fakeCredentials); //Without credentials
    //Then
    await expect(
      objectUnderTest.translate(testValueOne.text, testValueOne.lang)
    ).rejects.toThrow(TranslatorSdkError);
  });
});
