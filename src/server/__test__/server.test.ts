import supertest from "supertest";
import { server } from "../server";

describe("Server test suite", () => {
  const objectUnderTest = supertest(server);

  it('should return "Translator" when GET request is made to root', async () => {
    const response = await objectUnderTest.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Translator");
  });
});
