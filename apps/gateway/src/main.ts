import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { ProblemJsonFilter } from './common/filters/problem-json.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter for Problem+JSON
  app.useGlobalFilters(new ProblemJsonFilter());

  // API prefix
  app.setGlobalPrefix('v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Crisis Management Crew API')
    .setDescription('Multi-agent crisis response platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.GATEWAY_PORT || 3001;
  await app.listen(port);
  console.log(`Gateway running on port ${port}`);
}

bootstrap();
