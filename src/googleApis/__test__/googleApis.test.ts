import { GoogleTranslateError } from "../error/google.translator.excepitons";
import { GoogleTranslate, credentials } from "../googleApis";

describe("GoogleTranslate test suite", () => {
  const mockTranslationResponse = {
    data: {
      translations: [
        {
          translatedText: "Translated Text",
        },
      ],
    },
  };

  it("should translate text successfully", async () => {
    // Given
    const googleTranslate = new GoogleTranslate(credentials);
    const expectedTranslation = "Hola Mundo";
    // When
    const result = await googleTranslate.translate("Hello world", "es");
    // Then
    expect(result).toEqual(expectedTranslation);
  });

  it("should handle translation error", async () => {
    // Given
    const googleTranslate = new GoogleTranslate(credentials);
    // When
    googleTranslate["client"].translations.list = jest
      .fn()
      .mockRejectedValue(new Error("Translation error"));
    // Then
    await expect(googleTranslate.translate("Hello", "es")).rejects.toThrow(
      GoogleTranslateError
    );
  });
});
