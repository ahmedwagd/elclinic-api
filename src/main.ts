import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      `${process.env.FRONTEND_URL}`, // Allow requests from your frontend URL
      'http://localhost:3000', // Allow requests from localhost:3000
    ],
    methods: ['*'],
    credentials: true,
    // origin: true,
    // allowedHeaders: ['Authorization', 'Content-Type'],
    allowedHeaders: ['Content-Type'],
  });

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set the global interceptor for response transformation
  app.useGlobalInterceptors(new TransformInterceptor());

  // Set the global filter for handling exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3030;

  // Set the global route prefix
  app.setGlobalPrefix('api/v1');
  // await app.listen(process.env.PORT ?? 3030);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
