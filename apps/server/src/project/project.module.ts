import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectEnvironmentService } from "../project-environment/project-environment.service";

@Module({
  imports: [AuthModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectEnvironmentService],
  exports: [ProjectService],
})
export class ProjectModule {}
