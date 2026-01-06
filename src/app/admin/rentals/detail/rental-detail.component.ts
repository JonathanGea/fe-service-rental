import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RentalService } from '../../../shared/services/rental.service';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { RentalResponse, RentalUpdateRequest } from '../../../shared/models/rental.model';
import { VehicleResponse } from '../../../shared/models/vehicle.model';

@Component({
  selector: 'app-rental-detail-page',
  standalone: true,
  imports: [DatePipe, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './rental-detail.component.html'
})
export class RentalDetailPageComponent {
  private readonly rentalService = inject(RentalService);
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  rental: RentalResponse | null = null;
  vehicles: VehicleResponse[] = [];
  isLoading = false;
  isUpdating = false;
  errorMessage = '';

  readonly rentalForm = this.formBuilder.group({
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRental(id);
      this.loadVehicles();
    } else {
      this.errorMessage = 'ID rental tidak ditemukan.';
    }
  }

  loadRental(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.rentalService
      .getRental(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rental) => {
          this.rental = rental;
          this.patchForm(rental);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.rental = null;
        }
      });
  }

  loadVehicles(): void {
    this.vehicleService
      .getVehicles()
      .pipe(takeUntilDestroyed(this.destroyRef))
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
    if (!this.rental) {
      return;
    }

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

    this.isUpdating = true;
    this.errorMessage = '';

    const payload = this.buildPayload();

    this.rentalService
      .updateRental(this.rental.id, payload)
      .pipe(
        finalize(() => {
          this.isUpdating = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rental) => {
          this.rental = rental;
          this.patchForm(rental);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  getVehicleName(vehicleId: string): string {
    const vehicle = this.vehicles.find((item) => item.id === vehicleId);
    return vehicle?.name ?? vehicleId;
  }

  private patchForm(rental: RentalResponse): void {
    this.rentalForm.patchValue({
      renterName: rental.renterName,
      renterPhone: rental.renterPhone,
      renterAddress: rental.renterAddress,
      renterIdNumber: rental.renterIdNumber,
      startDate: rental.startDate,
      endDate: rental.endDate,
      pickupLocation: rental.pickupLocation ?? '',
      returnLocation: rental.returnLocation ?? '',
      priceTotal: rental.priceTotal,
      notes: rental.notes ?? ''
    });
  }

  private buildPayload(): RentalUpdateRequest {
    const value = this.rentalForm.value;
    return {
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
