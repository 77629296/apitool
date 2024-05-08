import { ProjectData, projectDataSchema } from "@apitool/schema";
import { Json } from "@apitool/utils";
import { Schema } from "zod";

import { Parser } from "../interfaces/parser";

export class ReactiveProjectParser implements Parser<Json, ProjectData> {
  schema: Schema;

  constructor() {
    this.schema = projectDataSchema;
  }

  readFile(file: File): Promise<Json> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const result = JSON.parse(reader.result as string) as Json;
          resolve(result);
        } catch (error) {
          reject(new Error("Failed to parse JSON"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      reader.readAsText(file);
    });
  }

  validate(data: Json) {
    return this.schema.parse(data) as ProjectData;
  }

  convert(data: ProjectData) {
    return data;
  }
}
