import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { VehiclesService, CreateVehicleDto, UpdateVehicleDto } from '../../vehicles.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-vehicle-upsert',
  standalone: true,
  providers: [provideAnimations()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatButtonModule,
  ],
  templateUrl: './vehicle-upsert.component.html',
  styleUrls: ['./vehicle-upsert.component.scss'],
})
export class VehicleUpsertComponent implements OnInit {
  id?: number;
  loading = signal(false);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: VehiclesService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      placa: [
        '',
        //[Validators.required, Validators.pattern(/^[A-Z]{3}\d[A-Z]\d{2}$|^[A-Z]{3}\d{4}$/)],
      ],
      chassi: [
        '',
        //[Validators.required, Validators.minLength(10)]
      ],
      renavam: [
        '',
        //[Validators.required, Validators.minLength(9)]
      ],
      modelo: [
        '',
        //[Validators.required, Validators.maxLength(60)]
      ],
      marca: [
        '',
        //[Validators.required, Validators.maxLength(60)]
      ],
      ano: [
        new Date().getFullYear(),
        //[Validators.required, Validators.min(1900), Validators.max(2100)],
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((p) => {
      if (p.has('id')) {
        this.id = Number(p.get('id'));
        this.loading.set(true);
        this.api.findOne(this.id).subscribe({
          next: (v) => {
            this.form.patchValue(v);
            this.loading.set(false);
            this.cdr.detectChanges();
          },
          error: () => this.loading.set(false),
        });
      } else {
        this.id = undefined;
        this.loading.set(false);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value as CreateVehicleDto;

    this.loading.set(true);

    const req$ = this.id ? this.api.update(this.id, dto as UpdateVehicleDto) : this.api.create(dto);

    req$.subscribe({
      next: () => {
        this.loading.set(false);

        this.snackBar.open(
          this.id ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!',
          'Fechar',
          { duration: 3000 }
        );

        this.router.navigate(['/vehicles']);
      },
      error: (err) => {
        this.loading.set(false);

        this.snackBar.open('Ocorreu um erro ao salvar o veículo.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });

        console.error(err);
      },
    });
  }

  cancel() {
    this.router.navigate(['/vehicles']);
  }
}
