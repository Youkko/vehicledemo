import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./vehicles/vehicles.routes').then(m => m.VEHICLES_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
