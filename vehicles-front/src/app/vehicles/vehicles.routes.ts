import { Routes } from '@angular/router';
import { VehiclesListComponent } from './pages/vehicles-list/vehicles-list.component';
import { VehicleUpsertComponent } from './pages/vehicle-upsert/vehicle-upsert.component';

export const VEHICLES_ROUTES: Routes = [
  { path: '', component: VehiclesListComponent },
  { path: 'vehicles', component: VehiclesListComponent },
  { path: 'vehicles/new', component: VehicleUpsertComponent },
  { path: 'vehicles/:id/edit', component: VehicleUpsertComponent },
];
