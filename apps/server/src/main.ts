import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { patchNestJsSwagger } from "nestjs-zod";

import { AppModule } from "./app.module";
import { Config } from "./config/schema";

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === "development" ? ["debug"] : ["error", "warn", "log"],
  });
  const configService = app.get(ConfigService<Config>);

  // Cookie Parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    credentials: true,
    origin: process.env.NODE_ENV === "production",
  });

  // Helmet - enabled only in production
  if (process.env.NODE_ENV === "production") {
    app.use(helmet({ contentSecurityPolicy: false }));
  }

  // Global Prefix
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  // Enable Shutdown Hooks
  app.enableShutdownHooks();

  // Swagger (OpenAPI Docs)
  // This can be accessed by visiting {SERVER_URL}/api/docs
  const config = new DocumentBuilder()
    .setTitle("APITool")
    .setDescription(
      "APITool is a locally deployable, frontend-backend integrated, and visual interface management platform.",
    )
    .addCookieAuth("Authentication", { type: "http", in: "cookie", scheme: "Bearer" })
    .setVersion("0.0.1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // Port
  const port = configService.get<number>("PORT") || 3000;

  await app.listen(port);

  Logger.log(`🚀 Server is up and running on port ${port}`, "Bootstrap");
}

bootstrap();
