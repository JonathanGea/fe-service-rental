import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RentalService } from '../../../shared/services/rental.service';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { VehicleResponse } from '../../../shared/models/vehicle.model';
import { RentalRequest } from '../../../shared/models/rental.model';

@Component({
  selector: 'app-rental-form-page',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './rental-form.component.html'
})
export class RentalFormPageComponent {
  private readonly rentalService = inject(RentalService);
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  vehicles: VehicleResponse[] = [];
  isLoadingVehicles = false;
  isSaving = false;
  errorMessage = '';

  readonly rentalForm = this.formBuilder.group({
    vehicleId: ['', [Validators.required]],
    renterName: ['', [Validators.required]],
    renterPhone: ['', [Validators.required]],
    renterAddress: ['', [Validators.required]],
    renterIdNumber: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    pickupLocation: [''],
    returnLocation: [''],
    priceTotal: [null as number | null, [Validators.required, Validators.min(0)]],
    notes: ['']
  });

  constructor() {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoadingVehicles = true;

    this.vehicleService
      .getVehicles()
      .pipe(
        finalize(() => {
          this.isLoadingVehicles = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
        },
        error: () => {
          this.vehicles = [];
        }
      });
  }

  submitForm(): void {
    if (this.rentalForm.invalid) {
      this.rentalForm.markAllAsTouched();
      return;
    }

    const startDate = this.rentalForm.value.startDate ?? '';
    const endDate = this.rentalForm.value.endDate ?? '';
    if (startDate && endDate && endDate < startDate) {
      this.errorMessage = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = this.buildPayload();

    this.rentalService
      .createRental(payload)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rental) => {
          this.router.navigate(['/admin/rentals', rental.id]);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  private buildPayload(): RentalRequest {
    const value = this.rentalForm.value;
    return {
      vehicleId: value.vehicleId ?? '',
      renterName: value.renterName ?? '',
      renterPhone: value.renterPhone ?? '',
      renterAddress: value.renterAddress ?? '',
      renterIdNumber: value.renterIdNumber ?? '',
      startDate: value.startDate ?? '',
      endDate: value.endDate ?? '',
      pickupLocation: value.pickupLocation ?? '',
      returnLocation: value.returnLocation ?? '',
      priceTotal: Number(value.priceTotal ?? 0),
      notes: value.notes ?? ''
    };
  }
}
