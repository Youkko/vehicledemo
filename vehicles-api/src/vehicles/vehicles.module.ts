import { Module } from "@nestjs/common";
import { VehiclesService } from "./vehicles.service";
import { VehiclesController } from "./vehicles.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

const mqUser = process.env.RABBIT_USER || 'guest';
const mqPass = process.env.RABBIT_PASS || 'guest';
const mqHost = process.env.RABBIT_HOST || 'rabbitmq';
const mqPort = process.env.RABBIT_PORT || '5672';
const mqName = process.env.RABBIT_VEHICLES_QUEUE || 'vehicles_queue';

@Module({
  imports: [
      ClientsModule.register([
      {
        name: 'VEHICLES_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${mqUser}:${mqPass}@${mqHost}:${mqPort}`],
          queue: mqName,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService]
})
export class VehiclesModule { }
