import { Component, DestroyRef, inject } from '@angular/core';
import { DecimalPipe, NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../shared/services/vehicle.service';
import { VehicleResponse } from '../../shared/models/vehicle.model';

interface VehicleSummary {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DecimalPipe, NgIf, NgStyle, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardPageComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);

  vehicles: VehicleResponse[] = [];
  summary: VehicleSummary = {
    total: 0,
    available: 0,
    rented: 0,
    maintenance: 0
  };
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService
      .getVehicles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
          this.summary = this.buildSummary(vehicles);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.vehicles = [];
          this.summary = {
            total: 0,
            available: 0,
            rented: 0,
            maintenance: 0
          };
        }
      });
  }

  private buildSummary(vehicles: VehicleResponse[]): VehicleSummary {
    const counts = {
      total: vehicles.length,
      available: 0,
      rented: 0,
      maintenance: 0
    };

    vehicles.forEach((vehicle) => {
      const status = vehicle.status?.toLowerCase();
      if (status === 'available') {
        counts.available += 1;
      } else if (status === 'rented') {
        counts.rented += 1;
      } else if (status === 'maintenance') {
        counts.maintenance += 1;
      }
    });

    return counts;
  }
}
