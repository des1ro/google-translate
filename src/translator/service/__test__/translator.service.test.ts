import { TranslatorService } from "../translator.service";
import { JSONObject } from "../../model/jsonObject.type";
import { FileService } from "../../../fileService/fileService";
import { GoogleTranslate } from "../../../googleApis/googleApis";
jest.mock("../../../googleApis/googleApis", () => {
  return {
    GoogleTranslate: jest.fn().mockImplementation(() => {
      return {
        translate: jest.fn(),
      };
    }),
  };
});
jest.mock("../../../fileService/fileService", () => {
  return {
    FileService: jest.fn().mockImplementation(() => {
      return {
        writeJSONObject: jest.fn(),
      };
    }),
  };
});
describe("TranslatorService test suite", () => {
  let objectUnderTest: TranslatorService;
  const fakeCredentials = {
    client_email: "wrong email",
    private_key: "wrong private key",
  };
  const mockedLang = "es";
  const mockedPathway = "test pathway";
  const mockedTranslatorApi = new GoogleTranslate(fakeCredentials);
  const mockedFileService = new FileService(mockedPathway);
  const objectToTest = {
    key1: "Hello",
    key2: "World",
    key3: {
      nestedKey: "Nested",
    },
  };
  const testTranslatedObjectOne: JSONObject = {
    key1: "Hola",
    key2: "Mundo",
    key3: {
      nestedKey: "Anidado",
    },
  };
  beforeEach(() => {
    objectUnderTest = new TranslatorService(
      mockedTranslatorApi,
      mockedFileService
    );
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("Should get a translated object", async () => {
    // Given
    jest
      .spyOn(mockedTranslatorApi, "translate")
      .mockResolvedValueOnce(JSON.stringify(testTranslatedObjectOne));

    const result = await objectUnderTest.getTranslatedObject(
      objectToTest,
      mockedLang
    );
    // Then
    expect(mockedTranslatorApi.translate).toHaveBeenCalled();
    expect(result).toEqual(testTranslatedObjectOne);
  });
  it("Should translate and save the object successfully", async () => {
    // Given
    jest
      .spyOn(mockedTranslatorApi, "translate")
      .mockResolvedValueOnce(JSON.stringify(testTranslatedObjectOne));
    jest
      .spyOn(mockedFileService, "writeJSONObject")
      .mockResolvedValue(undefined);
    // When
    await objectUnderTest.translateAndSaveObject(objectToTest, mockedLang);

    // Then
    expect(mockedTranslatorApi.translate).toHaveBeenCalledTimes(1);
    expect(mockedFileService.writeJSONObject).toHaveBeenCalledTimes(1);
  });
});
