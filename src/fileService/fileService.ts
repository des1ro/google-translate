import path from "path";
import { FileServiceError } from "./error/fileService-exceptions";
import { JSONObject } from "../translator/model/jsonObject.type";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const pathway = path.join(process.cwd(), process.env.CACHE!);

export class FileService {
  constructor(private readonly pathway: string) {}
  writeJSONObject(objectToSave: JSONObject): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(this.pathway, {
        encoding: process.env.ENCODING as BufferEncoding,
      });

      writeStream.on("error", (error) => {
        reject(
          new FileServiceError({
            name: "WRITING_ERROR",
            message: `Error during saving file: ${error.message}`,
          })
        );
      });

      writeStream.on("finish", () => {
        console.info("Data written");
        resolve();
      });

      const dataToWrite = JSON.stringify(objectToSave);
      writeStream.write(dataToWrite);
      writeStream.end();
    });
  }
}
