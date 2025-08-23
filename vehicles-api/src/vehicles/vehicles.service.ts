import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  private vehicles: Vehicle[] = [];
  private idCounter = 1;

  create(dto: CreateVehicleDto): Vehicle {
    const vehicle: Vehicle = { id: this.idCounter++, ...dto };
    this.vehicles.push(vehicle);
    return vehicle;
  }

  findAll(): Vehicle[] {
    return this.vehicles;
  }

  findOne(id: number): Vehicle {
    const vehicle = this.vehicles.find((v) => v.id === id);
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`);
    return vehicle;
  }

  update(id: number, dto: UpdateVehicleDto): Vehicle {
    const vehicle = this.findOne(id);
    Object.assign(vehicle, dto);
    return vehicle;
  }

  remove(id: number): void {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new NotFoundException(`Vehicle ${id} not found`);
    this.vehicles.splice(index, 1);
  }
}
