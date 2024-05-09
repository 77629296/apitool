import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import { ProjectEnvironmentDto } from "@apitool/dto";

export const ProjectEnvironment = createParamDecorator((data: keyof ProjectEnvironmentDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const projectEnvironment = request.payload?.projectEnvironment as ProjectEnvironmentDto;

  return data ? projectEnvironment?.[data] : projectEnvironment;
});
