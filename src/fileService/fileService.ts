import path from "path";
import { FileServiceError } from "./error/fileService-exceptions";
import { JSONObject } from "../translator/model/jsonObject.type";
import fs from "fs";
export const pathway = path.join(process.cwd(), "cache/data.json");

export class FileService {
  private readonly writeStream: fs.WriteStream;
  constructor(private readonly pathway: string) {
    this.writeStream = fs.createWriteStream(this.pathway, {
      encoding: "utf-8",
    });
  }
  async writeJSONObject<T>(objectToSave: JSONObject<T>) {
    this.writeStream.on("error", (error) => {
      throw new FileServiceError({
        name: "WRITING_ERROR",
        message: `Error during saving file: ${error.message}`,
      });
    });

    this.writeStream.on("finish", () => {
      console.log("Data written");
    });
    const dataToWrite = JSON.stringify(objectToSave);
    this.writeStream.write(dataToWrite);
    this.writeStream.end();
  }
}

const write = new FileService(pathway);

const obj: JSONObject<string | number | null> = {
  name: "John",
  age: 30,
  car: null,
};
write.writeJSONObject(obj);
console.log(pathway);
