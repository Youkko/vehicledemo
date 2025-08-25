import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const mqUser = process.env.RABBIT_USER || 'guest';
  const mqPass = process.env.RABBIT_PASS || 'guest';
  const mqHost = process.env.RABBIT_HOST || 'rabbitmq';
  const mqPort = process.env.RABBIT_PORT || 5672;
  const mqName = process.env.RABBIT_VEHICLES_QUEUE || 'vehicles_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${mqUser}:${mqPass}@${mqHost}:${mqPort}`],
        queue: mqName,
      }
    }
  );
  await app.listen();
}
bootstrap().catch((error) => console.error(error));
