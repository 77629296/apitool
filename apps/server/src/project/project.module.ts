import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  imports: [AuthModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
