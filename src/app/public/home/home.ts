import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../shared/services/vehicle.service';
import { PublicVehicleItemResponse } from '../../shared/models/public-vehicle.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, NgFor, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomePageComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);

  vehicles: PublicVehicleItemResponse[] = [];
  isLoading = false;
  errorMessage = '';
  selectedStatus = 'All';

  ngOnInit(): void {
    this.loadVehicles();
  }

  get statusFilters(): string[] {
    const statuses = new Set(
      this.vehicles
        .map((vehicle) => vehicle.status)
        .filter((status): status is string => Boolean(status?.trim()))
    );
    return ['All', ...Array.from(statuses)];
  }

  get filteredVehicles(): PublicVehicleItemResponse[] {
    if (this.selectedStatus === 'All') {
      return this.vehicles;
    }
    return this.vehicles.filter((vehicle) => vehicle.status === this.selectedStatus);
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService
      .getPublicVehicles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
          if (
            this.selectedStatus !== 'All' &&
            !this.vehicles.some((vehicle) => vehicle.status === this.selectedStatus)
          ) {
            this.selectedStatus = 'All';
          }
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.vehicles = [];
        }
      });
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
  }

  getStatusBadgeClass(status?: string): string {
    const normalized = status?.toLowerCase();
    if (normalized === 'available') {
      return 'bg-public-primary/10 text-public-primary';
    }
    if (normalized === 'rented') {
      return 'bg-public-surface-subtle text-public-muted';
    }
    if (normalized === 'maintenance') {
      return 'bg-public-primary/5 text-public-primary';
    }
    return 'bg-public-surface-subtle text-public-muted';
  }

  formatStatus(status?: string): string {
    if (!status) {
      return '-';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  isAvailable(status?: string): boolean {
    return status?.toLowerCase() === 'available';
  }

  buildWhatsAppLink(name: string): string {
    const message = `Halo saya ingin sewa ${name}`;
    return `https://wa.me/628123456789?text=${encodeURIComponent(message)}`;
  }
}
