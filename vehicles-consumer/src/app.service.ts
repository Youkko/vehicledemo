import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
//import { CreateVehicleDto } from './dto/create-vehicle.dto';
//import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams
} from './_interfaces'

class Veiculo {
  id!: number;
  placa!: string;
  chassi!: string;
  renavam!: string;
  modelo!: string;
  marca!: string;
  ano!: number;
}

@Injectable()
export class AppService {
  vehicles: Veiculo[] = [];
  id: number = 1;
  
  handleVehicleFindAll() {
    return this.vehicles;
  }
  
  handleVehicleFindOne(payload: FindVehicleParams): Veiculo {
    const vehicle = this.vehicles.find((v) => payload.id === v.id);
    if (!vehicle) {
      throw new RpcException({
        statusCode: 404,
        message: `Vehicle with ID ${payload.id} was not found`,
        error: 'Not Found'
      });
    }
    return vehicle;
  }

  handleVehicleCreate(payload: CreateVehicleParams) {
    console.log(`Novo veiculo - ${payload.data.marca} ${payload.data.modelo} ${payload.data.ano}, ${payload.data.placa}`);
    const data = { id: this.id++, ...payload.data };
    this.vehicles.push(data);
    return data;
  }

  handleVehicleUpdate(payload: UpdateVehicleParams) {
    const vehicle = this.handleVehicleFindOne({ id: payload.id });
    Object.assign(vehicle, payload.newData);
    const updated = this.handleVehicleFindOne({ id: payload.id });
    console.log(`Vehicle ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}, ${vehicle.placa} (${vehicle.renavam}/${vehicle.chassi}) updated to ${updated.marca} ${updated.modelo} ${updated.ano}, ${updated.placa} (${updated.renavam}/${updated.chassi})`);
    return updated;
  }

  handleVehicleDeletion(payload: DeleteVehicleParams) {
    this.vehicles = this.vehicles.filter((v) => v.id !== payload.id);
  }
}
