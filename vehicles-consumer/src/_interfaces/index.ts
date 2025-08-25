import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

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
