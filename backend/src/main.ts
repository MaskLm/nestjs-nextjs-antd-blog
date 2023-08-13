import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://localhost:4000',
      'http://localhost:4000',
      'http://127.0.0.1:4000',
      'https://127.0.0.1:4000',
    ],
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}

bootstrap();
