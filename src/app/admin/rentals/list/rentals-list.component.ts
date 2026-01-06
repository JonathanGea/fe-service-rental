import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RentalService } from '../../../shared/services/rental.service';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { RentalResponse } from '../../../shared/models/rental.model';
import { VehicleResponse } from '../../../shared/models/vehicle.model';

@Component({
  selector: 'app-rentals-list-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './rentals-list.component.html'
})
export class RentalsListPageComponent {
  private readonly rentalService = inject(RentalService);
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  rentals: RentalResponse[] = [];
  vehicles: VehicleResponse[] = [];
  isLoading = false;
  isLoadingVehicles = false;
  errorMessage = '';

  readonly filterForm = this.formBuilder.group({
    vehicleId: [''],
    status: [''],
    startDate: [''],
    endDate: ['']
  });

  constructor() {
    this.loadVehicles();
    this.loadRentals();
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

  loadRentals(): void {
    const { vehicleId, status, startDate, endDate } = this.filterForm.value;

    this.isLoading = true;
    this.errorMessage = '';

    this.rentalService
      .getRentals({
        vehicleId: vehicleId?.trim() || undefined,
        status: status?.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rentals) => {
          this.rentals = rentals;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.rentals = [];
        }
      });
  }

  resetFilters(): void {
    this.filterForm.reset({
      vehicleId: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    this.loadRentals();
  }

  getVehicleName(vehicleId: string): string {
    const vehicle = this.vehicles.find((item) => item.id === vehicleId);
    return vehicle?.name ?? vehicleId;
  }

  getStatusBadgeClass(status?: string): string {
    const normalized = status?.toLowerCase();
    if (normalized === 'active') {
      return 'bg-primary/15 text-primary';
    }
    if (normalized === 'returned') {
      return 'bg-app text-strong/70';
    }
    if (normalized === 'cancelled') {
      return 'bg-primary/10 text-primary/80';
    }
    return 'bg-app text-strong/60';
  }
}
