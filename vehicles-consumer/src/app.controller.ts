import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload, EventPattern, MessagePattern } from '@nestjs/microservices';
import type {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams
} from './_interfaces'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get-vehicles' })
  async handleVehicleFindAll() {
    return this.appService.handleVehicleFindAll();
  }

  @MessagePattern({ cmd: 'get-vehicle' })
  async handleVehicleFindOne(@Payload() payload: FindVehicleParams) {
    return this.appService.handleVehicleFindOne(payload);
  }

  @EventPattern('create-vehicle')
  async handleVehicleCreate(@Payload() payload: CreateVehicleParams) {
    return this.appService.handleVehicleCreate(payload);
  }

  @MessagePattern({ cmd: 'update-vehicle' })
  async handleVehicleUpdate(@Payload() payload: UpdateVehicleParams) {
    return this.appService.handleVehicleUpdate(payload);
  }

  @EventPattern('delete-vehicle')
  async handleVehicleDeletion(@Payload() payload: DeleteVehicleParams) {
    return this.appService.handleVehicleDeletion(payload);
  }
}
