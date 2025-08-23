import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesService } from './vehicles/vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  beforeEach(() => {
    service = new VehiclesService();
    controller = new VehiclesController(service);
  });

  it('should return created vehicle', () => {
    const vehicle = controller.create({
      placa: 'AAA1111',
      chassi: 'abc123',
      renavam: 'ren123',
      modelo: 'Gol',
      marca: 'VW',
      ano: 2021,
    });
    expect(vehicle).toHaveProperty('id');
  });

  it('should return all vehicles', () => {
    controller.create({
      placa: 'BBB2222',
      chassi: 'def456',
      renavam: 'ren456',
      modelo: 'Onix',
      marca: 'GM',
      ano: 2022,
    });
    const result = controller.findAll();
    expect(result).toHaveLength(1);
  });
});
