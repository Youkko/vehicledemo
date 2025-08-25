import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { RpcException } from '@nestjs/microservices';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams,
} from './_interfaces';

describe('AppService', () => {
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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleVehicleFindAll', () => {
    it('should return empty array initially', () => {
      const result = service.handleVehicleFindAll();
      expect(result).toEqual([]);
    });

    it('should return all vehicles', () => {
      service['vehicles'] = [mockVehicle];
      const result = service.handleVehicleFindAll();
      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('handleVehicleFindOne', () => {
    it('should return vehicle when found', () => {
      service['vehicles'] = [mockVehicle];
      const payload: FindVehicleParams = { id: 1 };
      
      const result = service.handleVehicleFindOne(payload);
      expect(result).toEqual(mockVehicle);
    });

    it('should throw RpcException when vehicle not found', () => {
      const payload: FindVehicleParams = { id: 999 };
      
      expect(() => service.handleVehicleFindOne(payload)).toThrow(RpcException);
      expect(() => service.handleVehicleFindOne(payload)).toThrow(
        'Vehicle with ID 999 was not found',
      );
    });
  });

  describe('handleVehicleCreate', () => {
    it('should create and return new vehicle', () => {
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

      const result = service.handleVehicleCreate(payload);
      
      expect(result).toEqual({
        id: 1,
        ...payload.data,
      });
      expect(service['vehicles']).toHaveLength(1);
      expect(service['id']).toBe(2);
    });
  });

  describe('handleVehicleUpdate', () => {
    it('should update and return updated vehicle', () => {
      service['vehicles'] = [{ ...mockVehicle }];
      const payload: UpdateVehicleParams = {
        id: 1,
        newData: {
          modelo: 'Civic',
          ano: 2024,
        },
      };

      const result = service.handleVehicleUpdate(payload);
      
      expect(result.modelo).toBe('Civic');
      expect(result.ano).toBe(2024);
      expect(result.marca).toBe('Honda'); // Should preserve other fields
    });

    it('should throw RpcException when updating non-existent vehicle', () => {
      const payload: UpdateVehicleParams = {
        id: 999,
        newData: { modelo: 'Civic' },
      };

      expect(() => service.handleVehicleUpdate(payload)).toThrow(RpcException);
    });
  });

  describe('handleVehicleDeletion', () => {
    it('should remove vehicle', () => {
      service['vehicles'] = [mockVehicle];
      const payload: DeleteVehicleParams = { id: 1 };

      service.handleVehicleDeletion(payload);
      
      expect(service['vehicles']).toHaveLength(0);
    });

    it('should not throw when deleting non-existent vehicle', () => {
      const payload: DeleteVehicleParams = { id: 999 };

      expect(() => service.handleVehicleDeletion(payload)).not.toThrow();
    });
  });
});