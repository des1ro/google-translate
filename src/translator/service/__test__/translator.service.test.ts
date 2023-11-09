import { TranslatorService } from "../translator.service";
import fs from "fs";
import path from "path";
import { JSONObject } from "../../model/jsonObject.type";
import { TranslatorSDK } from "../../translator-sdk/translator-sdk";
import { FileService } from "../../../fileService/fileService";

jest.mock("fs");

jest.mock("../../translator-sdk/translator-sdk", () => {
  return {
    TranslatorSDK: jest.fn().mockImplementation(() => {
      return {
        translate: jest.fn(),
      };
    }),
  };
});

describe("TranslatorService test suite", () => {
  let objectUnderTest: TranslatorService;
  let lang: string;
  const fakeCredentials = {
    client_email: "wrong email",
    private_key: "wrong private key",
  };
  const mockedPathway = "test pathway";
  const mockedTranslatorApi = new TranslatorSDK(fakeCredentials);
  const mockedFileService = new FileService(mockedPathway);
  const objectToTest = {
    key1: "Hello",
    key2: "World",
    key3: {
      nestedKey: "Nested",
    },
  };
  const testTranslatedObjectOne = {
    key1: "Hola",
    key2: "Mundo",
    key3: {
      nestedKey: "Anidado",
    },
  };

  beforeAll(() => {
    lang = "es";
  });

  beforeEach(() => {
    objectUnderTest = new TranslatorService(
      mockedTranslatorApi,
      mockedFileService
    );
    jest.resetAllMocks();
  });

  describe("getTranslatedObject", () => {
    it("Should get a translated object", async () => {
      // Given
      jest
        .spyOn(mockedTranslatorApi, "translate")
        .mockResolvedValueOnce("Hola");
      jest
        .spyOn(mockedTranslatorApi, "translate")
        .mockResolvedValueOnce("Mundo");
      jest
        .spyOn(mockedTranslatorApi, "translate")
        .mockResolvedValueOnce("Anidado");
      const result = await objectUnderTest.getTranslatedObject(
        objectToTest,
        lang
      );

      // Then
      expect(mockedTranslatorApi.translate).toBeCalledTimes(3);
      expect(result).toEqual(testTranslatedObjectOne);
    });

    it("Should not translate the 'action' key", async () => {
      // Given
      const testObject = {
        key1: "Nested",
        action: "action",
      };
      jest
        .spyOn(mockedTranslatorApi, "translate")
        .mockResolvedValueOnce("Anidado");
      const testTranslatedObjectTwo = {
        key1: "Anidado",
      };

      // When
      const result = await objectUnderTest.getTranslatedObject(
        testObject,
        lang
      );

      // Then
      expect(mockedTranslatorApi.translate).toBeCalledTimes(1);
      expect(result).toEqual(testTranslatedObjectTwo);
    });
  });

  describe("translateAndSaveObject", () => {
    it("Should translate and save the object successfully", async () => {
      // Given
      const mockTranslatedObject: JSONObject<string> = { original: "Anidado" };
      const mockJsonObject: JSONObject<string> = { original: "Nested" };

      jest
        .spyOn(objectUnderTest, "getTranslatedObject")
        .mockResolvedValueOnce(mockTranslatedObject);

      const writeFileMock = jest.spyOn(fs, "writeFile");
      const pathway = path.join(process.cwd(), "cache/data.json");

      // When
      await objectUnderTest.translateAndSaveObject(mockJsonObject, lang);

      // Then
      expect(writeFileMock).toHaveBeenCalledWith(
        pathway,
        JSON.stringify(mockTranslatedObject),
        "utf8",
        expect.any(Function)
      );

      expect(writeFileMock).toHaveBeenCalledTimes(1);
    });
  });
});
