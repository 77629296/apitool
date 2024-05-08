import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import { ProjectDto } from "@apitool/dto";

export const Project = createParamDecorator((data: keyof ProjectDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const project = request.payload?.project as ProjectDto;

  return data ? project?.[data] : project;
});
