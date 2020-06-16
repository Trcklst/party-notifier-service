import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        configuration.rabbitMq.host
      ],
      queue: configuration.rabbitMq.queue,
      noAck: false,
      prefetchCount: 1,
      maxRetries: 15
    }
  });

  await app.listenAsync();
}

bootstrap();
