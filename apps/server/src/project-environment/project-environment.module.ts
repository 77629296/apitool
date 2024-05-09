import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { ProjectEnvironmentController } from "./project-environment.controller";
import { ProjectEnvironmentService } from "./project-environment.service";

@Module({
  imports: [AuthModule],
  controllers: [ProjectEnvironmentController],
  providers: [ProjectEnvironmentService],
  exports: [ProjectEnvironmentService],
})
export class ProjectEnvironmentModule {}
