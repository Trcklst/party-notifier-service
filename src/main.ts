import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqp://rabbitmq'
      ],
      queue: 'party',
      noAck: false,
      prefetchCount: 1
    }
  });

  await app.listenAsync();
}

bootstrap();
