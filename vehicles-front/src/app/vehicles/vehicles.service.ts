import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string;
  marca: string;
  ano: number;
}

export interface CreateVehicleDto extends Omit<Vehicle, 'id'> {}
export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

@Injectable({ providedIn: 'root' })
export class VehiclesService {
  private readonly base = `${environment.apiBaseUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.base);
  }

  findOne(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.base}/${id}`);
  }

  create(dto: CreateVehicleDto): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.base, dto);
  }

  update(id: number, dto: UpdateVehicleDto): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
