import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
  imports: [AuthModule],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
