import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json, urlencoded } from "express";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ["error", "warn", "log", "debug", "verbose"],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    // Увеличиваем лимит для данных
    app.use(json({ limit: "10mb" }));
    app.use(urlencoded({ extended: true, limit: "10mb" }));

    app.enableCors({
      origin: "http://localhost:5173",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application started successfully on port ${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    logger.error("Failed to start application", error.stack);
    process.exit(1);
  }
}

bootstrap();
