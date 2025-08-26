import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, interval, switchMap, takeUntil } from 'rxjs';
import { finalize, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { VehiclesService, Vehicle } from '../../vehicles.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  providers: [provideAnimations()],
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss']
})
export class VehiclesListComponent implements OnInit, OnDestroy {
  displayedColumns = ['id', 'placa', 'modelo', 'marca', 'ano', 'actions'];
  vehicles$ = new BehaviorSubject<Vehicle[]>([]);
  loading = signal(false);

  private pollInterval = 5000;
  private alive = true;

  constructor(private api: VehiclesService, private router: Router) {}

  ngOnInit(): void {
    // primeira carga
    this.loadVehicles();

    // polling periódico
    interval(this.pollInterval)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.api.findAll())
      )
      .subscribe(list => {
        this.vehicles$.next(list);
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private loadVehicles() {
    this.loading.set(true);
    this.api.findAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(list => {
        this.vehicles$.next(list);
      });
  }

  new() {
    this.router.navigate(['/vehicles/new']);
  }

  edit(v: Vehicle) {
    this.router.navigate(['/vehicles', v.id, 'edit']);
  }

  remove(v: Vehicle) {
    this.loading.set(true);
    this.api.remove(v.id).subscribe({
      next: () => this.loadVehicles(),
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false)
    });
  }
}
