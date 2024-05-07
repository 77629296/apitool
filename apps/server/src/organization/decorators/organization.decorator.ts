import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import { OrganizationDto } from "@apitool/dto";

export const Organization = createParamDecorator((data: keyof OrganizationDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const organization = request.payload?.organization as OrganizationDto;

  return data ? organization?.[data] : organization;
});
