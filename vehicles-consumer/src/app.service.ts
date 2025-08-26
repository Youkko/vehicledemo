import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { Vehicle } from './entities/vehicle.entity';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams
} from './_interfaces'

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Vehicle)
    private repo: Repository<Vehicle>,
  ) {}

  async handleVehicleFindAll(): Promise<Vehicle[]> {
    return this.repo.find();
  }
  
  async handleVehicleFindOne(payload: FindVehicleParams): Promise<Vehicle> {
    const vehicle = await this.repo.findOne({ where: { id: payload.id } });
    if (!vehicle) {
      throw new RpcException({
        statusCode: 404,
        message: `Vehicle with ID ${payload.id} was not found`,
        error: 'Not Found'
      });
    }
    return vehicle;
  }

  async handleVehicleCreate(payload: CreateVehicleParams): Promise<Vehicle> {
    const vehicle = this.repo.create(payload.data);
    return this.repo.save(vehicle);
  }

  async handleVehicleUpdate(payload: UpdateVehicleParams): Promise<Vehicle> {
    await this.repo.update(payload.id, payload.newData);
    return await this.handleVehicleFindOne(payload);
  }

  async handleVehicleDeletion(payload: DeleteVehicleParams): Promise<void> {
    const result = await this.repo.delete(payload.id);
    if (result.affected === 0) {
      throw new RpcException({
        statusCode: 404,
        message: `Vehicle with ID ${payload.id} was not found`,
        error: 'Not Found'
      });
    }
  }
}
