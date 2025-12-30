import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { BrandService } from '../../../shared/services/brand.service';
import { VehicleTypeService } from '../../../shared/services/vehicle-type.service';
import { VehicleRequest, VehicleResponse } from '../../../shared/models/vehicle.model';
import { BrandResponse } from '../../../shared/models/brand.model';
import { VehicleTypeResponse } from '../../../shared/models/vehicle-type.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vehicle-form-page',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-form.component.html'
})
export class VehicleFormPageComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly brandService = inject(BrandService);
  private readonly vehicleTypeService = inject(VehicleTypeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  optionsErrorMessage = '';
  vehicleId: string | null = null;
  brands: BrandResponse[] = [];
  vehicleTypes: VehicleTypeResponse[] = [];
  isLoadingOptions = false;

  readonly statusOptions = ['available', 'rented', 'maintenance', 'unavailable'];

  readonly vehicleForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    brandId: ['', [Validators.required]],
    vehicleTypeId: ['', [Validators.required]],
    year: [null as number | null, [Validators.required, Validators.min(1)]],
    transmission: ['', [Validators.required]],
    capacity: [null as number | null, [Validators.required, Validators.min(1)]],
    pricePerDay: [null as number | null, [Validators.required, Validators.min(0)]],
    description: [''],
    status: ['', [Validators.required]]
  });

  constructor() {
    this.loadOptions();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.vehicleId = id;
      this.loadVehicle(id);
    }
  }

  loadOptions(): void {
    this.isLoadingOptions = true;
    this.optionsErrorMessage = '';

    forkJoin({
      brands: this.brandService.getBrands(),
      vehicleTypes: this.vehicleTypeService.getVehicleTypes()
    })
      .pipe(
        finalize(() => {
          this.isLoadingOptions = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ brands, vehicleTypes }) => {
          this.brands = brands;
          this.vehicleTypes = vehicleTypes;
        },
        error: (error: Error) => {
          this.optionsErrorMessage = error.message;
          this.brands = [];
          this.vehicleTypes = [];
        }
      });
  }

  loadVehicle(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService
      .getVehicle(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicle) => {
          this.patchForm(vehicle);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  submitForm(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = this.buildPayload();
    const request$ = this.isEditMode && this.vehicleId
      ? this.vehicleService.updateVehicle(this.vehicleId, payload)
      : this.vehicleService.createVehicle(payload);

    request$
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicle) => {
          this.router.navigate(['/admin/vehicles', vehicle.id]);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  private patchForm(vehicle: VehicleResponse): void {
    this.vehicleForm.patchValue({
      name: vehicle.name,
      brandId: vehicle.brandId,
      vehicleTypeId: vehicle.vehicleTypeId,
      year: vehicle.year,
      transmission: vehicle.transmission,
      capacity: vehicle.capacity,
      pricePerDay: vehicle.pricePerDay,
      description: vehicle.description ?? '',
      status: vehicle.status
    });
  }

  private buildPayload(): VehicleRequest {
    const value = this.vehicleForm.value;
    return {
      name: value.name ?? '',
      brandId: value.brandId ?? '',
      vehicleTypeId: value.vehicleTypeId ?? '',
      year: Number(value.year ?? 0),
      transmission: value.transmission ?? '',
      capacity: Number(value.capacity ?? 0),
      pricePerDay: Number(value.pricePerDay ?? 0),
      description: value.description ?? '',
      status: value.status ?? ''
    };
  }
}
