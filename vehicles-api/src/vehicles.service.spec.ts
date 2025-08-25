import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles/vehicles.service';
import { of, throwError } from 'rxjs';
import {
  GatewayTimeoutException,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams,
} from './_interfaces';

describe('VehiclesService', () => {
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

  const mockClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: 'VEHICLES_RMQ',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      mockClientProxy.send.mockReturnValue(of([mockVehicle]));

      const result = await service.findAll();
      
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-vehicles' },
        {},
      );
      expect(result).toEqual([mockVehicle]);
    });

    it('should throw GatewayTimeoutException on timeout', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => ({ name: 'TimeoutError' })),
      );

      await expect(service.findAll()).rejects.toThrow(GatewayTimeoutException);
    });

    it('should throw NotFoundException when received 404', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => ({
          statusCode: 404,
          message: 'Vehicle not found',
        })),
      );

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('should throw BadGatewayException on other errors', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => new Error('Some error')),
      );

      await expect(service.findAll()).rejects.toThrow(BadGatewayException);
    });
  });

  describe('findOne', () => {
    it('should return a vehicle', async () => {
      const payload: FindVehicleParams = { id: 1 };
      mockClientProxy.send.mockReturnValue(of(mockVehicle));

      const result = await service.findOne(payload);
      
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'get-vehicle' },
        payload,
      );
      expect(result).toEqual(mockVehicle);
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      const payload: FindVehicleParams = { id: 999 };
      mockClientProxy.send.mockReturnValue(
        throwError(() => ({
          statusCode: 404,
          message: 'Vehicle not found',
        })),
      );

      await expect(service.findOne(payload)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should emit an event and return success message', () => {
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

      const result = service.create(payload);
      
      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'create-vehicle',
        payload,
      );
      expect(result).toEqual({ message: 'Vehicle data sent' });
    });
  });

  describe('update', () => {
    it('should update and return the vehicle', async () => {
      const payload: UpdateVehicleParams = {
        id: 1,
        newData: { modelo: 'Civic' },
      };
      const updatedVehicle = { ...mockVehicle, modelo: 'Civic' };
      mockClientProxy.send.mockReturnValue(of(updatedVehicle));

      const result = await service.update(payload);
      
      expect(mockClientProxy.send).toHaveBeenCalledWith(
        { cmd: 'update-vehicle' },
        payload,
      );
      expect(result).toEqual(updatedVehicle);
    });
  });

  describe('remove', () => {
    it('should emit an event and return success message', () => {
      const payload: DeleteVehicleParams = { id: 1 };

      const result = service.remove(payload);
      
      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'delete-vehicle',
        payload,
      );
      expect(result).toEqual({ message: 'Delete request sent' });
    });
  });

  describe('rpc error handling', () => {
    it('should handle nested error objects', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => ({
          error: {
            statusCode: 404,
            message: 'Nested error',
          },
        })),
      );

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });

    it('should handle unknown error format', async () => {
      mockClientProxy.send.mockReturnValue(
        throwError(() => 'Unknown error format'),
      );

      await expect(service.findAll()).rejects.toThrow(BadGatewayException);
    });
  });
});
