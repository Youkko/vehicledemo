import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehiclesService, Vehicle } from './vehicles.service';
import { environment } from '../../environments/environment';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBaseUrl}/vehicles`;

  const vehicleMock: Vehicle = {
    id: 1, placa: 'ABC1D23', chassi: '9BW111060T5002156',
    renavam: '00123456789', modelo: 'HR-V', marca: 'Honda', ano: 2025,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VehiclesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('findAll', () => {
    service.findAll().subscribe(res => {
      expect(res).toEqual([vehicleMock]);
    });
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('GET');
    req.flush([vehicleMock]);
  });

  it('findOne', () => {
    service.findOne(1).subscribe(res => {
      expect(res).toEqual(vehicleMock);
    });
    const req = httpMock.expectOne(`${base}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(vehicleMock);
  });

  it('create', () => {
    const dto = { ...vehicleMock, id: undefined } as any;
    service.create(dto).subscribe(res => {
      expect(res).toEqual(vehicleMock);
    });
    const req = httpMock.expectOne(base);
    expect(req.request.method).toBe('POST');
    req.flush(vehicleMock);
  });

  it('update', () => {
    service.update(1, { modelo: 'Civic' }).subscribe(res => {
      expect(res).toEqual({ ...vehicleMock, modelo: 'Civic' });
    });
    const req = httpMock.expectOne(`${base}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...vehicleMock, modelo: 'Civic' });
  });

  it('remove', () => {
    service.remove(1).subscribe(res => {
      expect(res).toBeUndefined();
    });
    const req = httpMock.expectOne(`${base}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
