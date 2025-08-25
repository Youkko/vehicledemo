import { IsString, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  placa!: string;

  @IsString()
  chassi!: string;

  @IsString()
  renavam!: string;

  @IsString()
  modelo!: string;

  @IsString()
  marca!: string;

  @IsNumber()
  ano!: number;
}
