import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { RedisHealthModule } from "@songkeys/nestjs-redis-health";

import { DatabaseHealthIndicator } from "./database.health";
import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule, RedisHealthModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator],
})
export class HealthModule {}
