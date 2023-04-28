import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitService } from './rmq/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rabbitService = app.get(RabbitService);
  await rabbitService.init();

  await app.listen(3000);
}
bootstrap();
