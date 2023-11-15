import { app, server } from "../server";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config();
describe("Express App test suite", () => {
  const port = process.env.PORT;
  const spyConsole = jest
    .spyOn(global.console, "log")
    .mockImplementationOnce(() => {});
  const request = supertest(app);

  describe("Routes test suite", () => {
    const mockedResponseSend = {
      lang: "en",
      data: { text: "Hello" },
    };
    it('responds with 200 and "Translator" for GET /', async () => {
      // When
      const response = await request.get("/");
      // Then
      expect(response.status).toBe(200);
      expect(response.text).toBe("Translator");
    });

    it("responds with 404 for unknown routes", async () => {
      // When
      const response = await request.get("/unknown-route");
      // Then
      expect(response.status).toBe(404);
    });
    it("should respond to POST /translate", async () => {
      // When
      const response = await request
        .post("/translate")
        .send(mockedResponseSend);
      // Then
      expect(response.status).toBe(201);
    });

    it("should respond to POST /translateAndSave", async () => {
      // When

      const response = await request
        .post("/translateAndSave")
        .send(mockedResponseSend);
      // Then
      expect(response.status).toBe(204);
    });
    it("should say that the server is running", () => {
      expect(spyConsole).toHaveBeenCalledWith(
        `Server is running at http://localhost:${port}`
      );
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});
