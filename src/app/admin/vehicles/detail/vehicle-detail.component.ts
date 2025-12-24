import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { VehicleResponse } from '../../../shared/models/vehicle.model';

@Component({
  selector: 'app-vehicle-detail-page',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgClass, NgIf, RouterLink],
  templateUrl: './vehicle-detail.component.html'
})
export class VehicleDetailPageComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  vehicle: VehicleResponse | null = null;
  isLoading = false;
  errorMessage = '';
  statusValue = '';
  isUpdatingStatus = false;

  readonly statusOptions = ['available', 'rented', 'maintenance', 'unavailable'];

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(id);
    } else {
      this.errorMessage = 'ID kendaraan tidak ditemukan.';
    }
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
          this.vehicle = vehicle;
          this.statusValue = vehicle.status;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.vehicle = null;
        }
      });
  }

  updateStatus(): void {
    if (!this.vehicle) {
      return;
    }

    this.isUpdatingStatus = true;
    this.errorMessage = '';

    this.vehicleService
      .updateStatus(this.vehicle.id, { status: this.statusValue })
      .pipe(
        finalize(() => {
          this.isUpdatingStatus = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicle) => {
          this.vehicle = vehicle;
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
