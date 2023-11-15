import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { FileServiceError } from "../error/fileService-exceptions";
import { FileService } from "../fileService";
dotenv.config();
describe("FileService test suite", () => {
  const spyConsole = jest.spyOn(console, "info").mockReturnValueOnce(undefined);
  let objectUnderTest: FileService;
  const testPath = path.join(process.cwd(), process.env.TESTPATH!);
  const testObject = { key: "value" };
  beforeEach(() => {
    objectUnderTest = new FileService(testPath);
  });
  describe("WriteJSONObject test suite", () => {
    it("writeJSONObject should write JSON object to file", async () => {
      // When
      await objectUnderTest.writeJSONObject(testObject);
      // Then
      expect(fs.existsSync(testPath)).toBeTruthy();
      const fileContent = fs.readFileSync(testPath, "utf-8");
      expect(JSON.parse(fileContent)).toEqual(testObject);
    });
    it("should confirm that data is written", async () => {
      // Then
      expect(spyConsole).toHaveBeenCalledTimes(1);
      expect(spyConsole).toHaveBeenCalledWith("Data written");
    });
    it("should throw FileServiceError on error", async () => {
      // Given
      objectUnderTest = new FileService("/nonexistent/path");
      // When and Then
      try {
        await objectUnderTest.writeJSONObject(testObject);
        fail(
          "Expected writeJSONObject to throw FileServiceError but it didn't."
        );
      } catch (error) {
        expect(error).toBeInstanceOf(FileServiceError);
      }
    });
  });
});
