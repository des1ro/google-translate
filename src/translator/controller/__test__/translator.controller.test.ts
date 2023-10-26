import { TranslatorController } from "../translator.controller";
import { TranslatorService } from "../../service/translator.service";
import { Request, Response } from "express";
import { JSONObject } from "../../jsonObject.type";

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

  beforeEach(() => {
    mockedTranslatorService = new TranslatorService();
    objectUnderTest = new TranslatorController(mockedTranslatorService);
    req = {
      query: lang,
      body: {
        data,
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
    jest
      .spyOn(mockedTranslatorService, "getTranslatedObject")
      .mockResolvedValue(testedData);
    //When
    await objectUnderTest.translate(req as Request, res as Response);
    //Then
    expect(mockedTranslatorService.getTranslatedObject).toHaveBeenCalledWith(
      req.body.data,
      req.query?.lang
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(testTranslatedData);
  });

  it("Should handle error in translateService", async () => {
    //Given
    const testError = new Error("test error");
    jest
      .spyOn(mockedTranslatorService, "getTranslatedObject")
      .mockRejectedValue(testError);
    //When
    await objectUnderTest.translate(req as Request, res as Response);
    //Then
    expect(mockedTranslatorService.getTranslatedObject).toHaveBeenCalledWith(
      req.body.data,
      req.query?.lang
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(`Error: ${testError}`);
  });

  it("Should translate and save data and return success message", async () => {
    //When
    await objectUnderTest.translateAndSave(req as Request, res as Response);
    //Then
    expect(mockedTranslatorService.translateAndSaveObject).toHaveBeenCalledWith(
      req.body.data,
      req.query?.lang
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith("Success");
  });
});
