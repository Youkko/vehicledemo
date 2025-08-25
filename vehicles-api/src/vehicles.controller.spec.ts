import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesService } from './vehicles/vehicles.service';
import { CreateVehicleDto } from './vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from './vehicles/dto/update-vehicle.dto';
import {
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  const mockVehicle = {
    id: 1,
    placa: 'ABC1D23',
    chassi: '9BW111060T5002156',
    renavam: '00123456789',
    modelo: 'HR-V',
    marca: 'Honda',
    ano: 2025,
  };

  const mockVehiclesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      mockVehiclesService.findAll.mockResolvedValue([mockVehicle]);

      const result = await controller.findAll();
      
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });

    it('should propagate service errors', async () => {
      mockVehiclesService.findAll.mockRejectedValue(new BadGatewayException());
      
      await expect(controller.findAll()).rejects.toThrow(BadGatewayException);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle when found', async () => {
      mockVehiclesService.findOne.mockResolvedValue(mockVehicle);

      const result = await controller.findOne(1);
      
      expect(service.findOne).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockVehicle);
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      mockVehiclesService.findOne.mockRejectedValue(new NotFoundException('Vehicle not found'));
      
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a vehicle and return success message', () => {
      const createDto: CreateVehicleDto = {
        placa: 'ABC1D23',
        chassi: '9BW111060T5002156',
        renavam: '00123456789',
        modelo: 'HR-V',
        marca: 'Honda',
        ano: 2025,
      };
      const successMessage = { message: 'Cadastro enviado' };
      mockVehiclesService.create.mockReturnValue(successMessage);

      const result = controller.create(createDto);
      
      expect(service.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(successMessage);
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const updateDto: UpdateVehicleDto = { modelo: 'Civic' };
      const updatedVehicle = { ...mockVehicle, modelo: 'Civic' };
      mockVehiclesService.update.mockResolvedValue(updatedVehicle);

      const result = await controller.update(1, updateDto);
      
      expect(service.update).toHaveBeenCalledWith({
        id: 1,
        newData: updateDto,
      });
      expect(result).toEqual(updatedVehicle);
    });

    it('should throw NotFoundException when updating non-existent vehicle', async () => {
      const updateDto: UpdateVehicleDto = { modelo: 'Civic' };
      mockVehiclesService.update.mockRejectedValue(new NotFoundException('Vehicle not found'));
      
      await expect(controller.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle and return success message', () => {
      const successMessage = { message: 'Solicitação de exclusão enviada' };
      mockVehiclesService.remove.mockReturnValue(successMessage);

      const result = controller.remove(1);
      
      expect(service.remove).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(successMessage);
    });
  });
});