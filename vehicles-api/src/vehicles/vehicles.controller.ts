import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams
} from '../_interfaces'
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete
} from '@nestjs/common';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const payload: FindVehicleParams = { id }
    return this.service.findOne(payload);
  }

  @Post()
  create(@Body() dto: CreateVehicleDto) {
    const payload: CreateVehicleParams = { data: dto }
    return this.service.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto) {
    const payload: UpdateVehicleParams = { id, newData: dto }
    return this.service.update(payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const payload: DeleteVehicleParams = { id }
    return this.service.remove(payload);
  }
}
