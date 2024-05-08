import { ProjectData } from "@apitool/schema";
import { ZodDto } from "nestjs-zod/dto";
import { Schema } from "zod";

export interface Parser<Data = unknown, T = ZodDto, Result = ProjectData> {
  schema?: Schema;

  readFile(file: File): Promise<Data>;

  validate(data: Data): T | Promise<T>;

  convert(data: T): Result | Promise<Result>;
}
