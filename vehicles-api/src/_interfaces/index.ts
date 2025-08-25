import { CreateVehicleDto } from '../vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../vehicles/dto/update-vehicle.dto';

export interface FindVehicleParams {
  id: number
}

export interface UpdateVehicleParams {
  id: number
  newData: UpdateVehicleDto
}

export interface CreateVehicleParams {
  data: CreateVehicleDto
}

export interface DeleteVehicleParams {
  id: number
}