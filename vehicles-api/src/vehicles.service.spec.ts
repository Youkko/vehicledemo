import { VehiclesService } from './vehicles/vehicles.service';

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(() => {
    service = new VehiclesService();
  });

  it('should create a vehicle', () => {
    const vehicle = service.create({
      placa: 'ABC1234',
      chassi: '123456',
      renavam: '987654',
      modelo: 'Civic',
      marca: 'Honda',
      ano: 2020,
    });
    expect(vehicle).toHaveProperty('id');
    expect(service.findAll()).toHaveLength(1);
  });

  it('should update a vehicle', () => {
    const created = service.create({
      placa: 'XYZ9876',
      chassi: '654321',
      renavam: '123789',
      modelo: 'Corolla',
      marca: 'Toyota',
      ano: 2019,
    });
    const updated = service.update(created.id, { modelo: 'Corolla Altis' });
    expect(updated.modelo).toBe('Corolla Altis');
  });

  it('should delete a vehicle', () => {
    const created = service.create({
      placa: 'QWE1234',
      chassi: '111222',
      renavam: '333444',
      modelo: 'Focus',
      marca: 'Ford',
      ano: 2018,
    });
    service.remove(created.id);
    expect(service.findAll()).toHaveLength(0);
  });
});
