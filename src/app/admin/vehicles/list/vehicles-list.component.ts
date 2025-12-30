import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { VehicleResponse } from '../../../shared/models/vehicle.model';

@Component({
  selector: 'app-vehicles-list-page',
  standalone: true,
  imports: [DecimalPipe, NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicles-list.component.html'
})
export class VehiclesListPageComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  readonly filterForm = this.formBuilder.group({
    status: [''],
    query: ['']
  });

  vehicles: VehicleResponse[] = [];
  isLoading = false;
  errorMessage = '';
  vehicleToDelete: VehicleResponse | null = null;
  isDeleting = false;

  readonly statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'available', label: 'Available' },
    { value: 'rented', label: 'Rented' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  constructor() {
    this.loadVehicles();
  }

  loadVehicles(): void {
    const { status, query } = this.filterForm.value;
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService
      .getVehicles(status ?? '', query ?? '')
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.vehicles = [];
        }
      });
  }

  resetFilters(): void {
    this.filterForm.reset({
      status: '',
      query: ''
    });
    this.loadVehicles();
  }

  confirmDelete(vehicle: VehicleResponse): void {
    this.vehicleToDelete = vehicle;
  }

  cancelDelete(): void {
    if (this.isDeleting) {
      return;
    }
    this.vehicleToDelete = null;
  }

  deleteVehicle(): void {
    if (!this.vehicleToDelete) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.vehicleService
      .deleteVehicle(this.vehicleToDelete.id)
      .pipe(
        finalize(() => {
          this.isDeleting = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.vehicleToDelete = null;
          this.loadVehicles();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  getStatusBadgeClass(status?: string): string {
    const normalized = status?.toLowerCase();
    if (normalized === 'available') {
      return 'bg-primary/15 text-primary';
    }
    if (normalized === 'rented') {
      return 'bg-app text-strong/70';
    }
    if (normalized === 'maintenance') {
      return 'bg-primary/10 text-primary/80';
    }
    return 'bg-app text-strong/60';
  }
}
