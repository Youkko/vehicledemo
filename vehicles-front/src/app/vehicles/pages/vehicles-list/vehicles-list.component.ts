import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  signal,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { interval, switchMap } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { VehiclesService, Vehicle } from '../../vehicles.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  providers: [provideAnimations()],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
})
export class VehiclesListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['id', 'placa', 'modelo', 'marca', 'ano', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>([]);
  loading = signal(false);

  private pollInterval = 2000;
  private alive = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: VehiclesService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVehicles();

    interval(this.pollInterval)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.api.findAll())
      )
      .subscribe((list) => {
        this.dataSource.data = list;
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    // Configura paginação e ordenação
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Ordenação padrão: ID ascendente
    // Atrasando para o próximo ciclo de detecção para evitar NG0100
    setTimeout(() => {
      this.sort.active = 'id';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit();
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private loadVehicles() {
    this.loading.set(true);
    this.api.findAll().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: () => this.loading.set(false),
      complete: () => this.loading.set(false),
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
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Veículo removido com sucesso!', 'Fechar', { duration: 3000 });
        this.loadVehicles();
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open('Erro ao remover o veículo.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error(err);
      },
    });
  }
}
