import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import { ResourceDto } from "@apitool/dto";

export const Resource = createParamDecorator((data: keyof ResourceDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const resource = request.payload?.resource as ResourceDto;

  return data ? resource?.[data] : resource;
});
