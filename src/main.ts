import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitService } from './rmq/rmq.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rabbitService = app.get(RabbitService);
  await rabbitService.init();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
