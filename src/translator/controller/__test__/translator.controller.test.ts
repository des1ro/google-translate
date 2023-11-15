import { TranslatorController } from "../translator.controller";
import { TranslatorService } from "../../service/translator.service";
import { Request, Response } from "express";
import { JSONObject } from "../../model/jsonObject.type";
import { FileService } from "../../../fileService/fileService";
import { GoogleTranslate } from "../../../googleApis/googleApis";

jest.mock("../../service/translator.service");

describe("TranslatorController test suite", () => {
  let objectUnderTest: TranslatorController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockedTranslatorService: TranslatorService;
  const lang = { lang: "es" };
  const data = {
    key1: "Hello",
    key2: "World",
    key3: {
      nestedKey: "Nested",
    },
  };
  const testTranslatedData = {
    key1: "Hola",
    key2: "Mundo",
    key3: {
      nestedKey: "Anidado",
    },
  };
  const fakeCredentials = {
    client_email: "wrong email",
    private_key: "wrong private key",
  };

  const testPathWay = "test path";
  beforeEach(() => {
    mockedTranslatorService = new TranslatorService(
      new GoogleTranslate(fakeCredentials),
      new FileService(testPathWay)
    );
    objectUnderTest = new TranslatorController(mockedTranslatorService);
    req = {
      body: {
        data,
        lang,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("Should translate and return translated data", async () => {
    //Given
    const testedData: Promise<JSONObject> = Promise.resolve(testTranslatedData);
    const spy = jest
      .spyOn(mockedTranslatorService, "getTranslatedObject")
      .mockResolvedValue(testedData);
    //When
    await objectUnderTest.translate(req as Request, res as Response);
    //Then
    expect(mockedTranslatorService.getTranslatedObject).toHaveBeenCalledWith(
      req.body.data,
      req.body.lang
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(testTranslatedData);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("Should handle error in translateService", async () => {
    //Given
    const testError = new Error("test error");
    const spy = jest
      .spyOn(mockedTranslatorService, "getTranslatedObject")
      .mockRejectedValue(testError);
    //When
    await objectUnderTest.translate(req as Request, res as Response);
    //Then
    expect(mockedTranslatorService.getTranslatedObject).toHaveBeenCalledWith(
      req.body.data,
      req.body.lang
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(`Error: ${testError}`);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("Should translate and save data and return success message", async () => {
    //When
    await objectUnderTest.translateAndSave(req as Request, res as Response);
    //Then
    expect(mockedTranslatorService.translateAndSaveObject).toHaveBeenCalledWith(
      req.body.data,
      req.body.lang
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith("Success");
  });
});
