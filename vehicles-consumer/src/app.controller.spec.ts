import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams,
} from './_interfaces';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockVehicle = {
    id: 1,
    placa: 'ABC1D23',
    chassi: '9BW111060T5002156',
    renavam: '00123456789',
    modelo: 'HR-V',
    marca: 'Honda',
    ano: 2025,
  };

  const mockAppService = {
    handleVehicleFindAll: jest.fn(),
    handleVehicleFindOne: jest.fn(),
    handleVehicleCreate: jest.fn(),
    handleVehicleUpdate: jest.fn(),
    handleVehicleDeletion: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleVehicleFindAll', () => {
    it('should call service.handleVehicleFindAll', () => {
      mockAppService.handleVehicleFindAll.mockReturnValue([mockVehicle]);
      
      const result = controller.handleVehicleFindAll();
      
      expect(service.handleVehicleFindAll).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('handleVehicleFindOne', () => {
    it('should call service.handleVehicleFindOne with payload', () => {
      const payload: FindVehicleParams = { id: 1 };
      mockAppService.handleVehicleFindOne.mockReturnValue(mockVehicle);
      
      const result = controller.handleVehicleFindOne(payload);
      
      expect(service.handleVehicleFindOne).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('handleVehicleCreate', () => {
    it('should call service.handleVehicleCreate with payload', () => {
      const payload: CreateVehicleParams = {
        data: {
          placa: 'ABC1D23',
          chassi: '9BW111060T5002156',
          renavam: '00123456789',
          modelo: 'HR-V',
          marca: 'Honda',
          ano: 2025,
        },
      };
      mockAppService.handleVehicleCreate.mockReturnValue({ id: 1, ...payload.data });
      
      const result = controller.handleVehicleCreate(payload);
      
      expect(service.handleVehicleCreate).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ id: 1, ...payload.data });
    });
  });

  describe('handleVehicleUpdate', () => {
    it('should call service.handleVehicleUpdate with payload', () => {
      const payload: UpdateVehicleParams = {
        id: 1,
        newData: { modelo: 'Civic' },
      };
      mockAppService.handleVehicleUpdate.mockReturnValue({ ...mockVehicle, modelo: 'Civic' });
      
      const result = controller.handleVehicleUpdate(payload);
      
      expect(service.handleVehicleUpdate).toHaveBeenCalledWith(payload);
      expect(result.modelo).toBe('Civic');
    });
  });

  describe('handleVehicleDeletion', () => {
    it('should call service.handleVehicleDeletion with payload', () => {
      const payload: DeleteVehicleParams = { id: 1 };
      
      controller.handleVehicleDeletion(payload);
      
      expect(service.handleVehicleDeletion).toHaveBeenCalledWith(payload);
    });
  });
});