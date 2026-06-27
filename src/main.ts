import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { envs } from '@config/index';

async function bootstrap() {
  const logger = new Logger('Main - Argos API');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: envs.clientUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Argos API')
    .setDescription('API para gestión de productos y ventas')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'ApiKey',
        description: 'Bearer token — API key generated via CLI scripts',
      },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(envs.port);

  logger.log(`API is running on port: ${envs.port}`);
  logger.log(`Swagger docs available at: http://localhost:${envs.port}/docs`);
}
void bootstrap();
