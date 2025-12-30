import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../shared/services/vehicle.service';
import { VehicleResponse } from '../../shared/models/vehicle.model';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DecimalPipe, NgClass, NgFor, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomePageComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);

  vehicles: VehicleResponse[] = [];
  isLoading = false;
  errorMessage = '';
  selectedType = 'All';

  ngOnInit(): void {
    this.loadVehicles();
  }

  get typeFilters(): string[] {
    const types = new Set(
      this.vehicles
        .map((vehicle) => vehicle.type)
        .filter((type): type is string => Boolean(type?.trim()))
    );
    return ['All', ...Array.from(types)];
  }

  get filteredVehicles(): VehicleResponse[] {
    if (this.selectedType === 'All') {
      return this.vehicles;
    }
    return this.vehicles.filter((vehicle) => vehicle.type === this.selectedType);
  }

  loadVehicles(): void {
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
          if (
            this.selectedType !== 'All' &&
            !this.vehicles.some((vehicle) => vehicle.type === this.selectedType)
          ) {
            this.selectedType = 'All';
          }
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.vehicles = [];
        }
      });
  }

  selectType(type: string): void {
    this.selectedType = type;
  }

  getStatusBadgeClass(status?: string): string {
    const normalized = status?.toLowerCase();
    if (normalized === 'available') {
      return 'bg-public-primary/15 text-public-primary';
    }
    if (normalized === 'rented') {
      return 'bg-public-strong/10 text-public-strong/70';
    }
    if (normalized === 'maintenance') {
      return 'bg-public-primary/10 text-public-primary/80';
    }
    return 'bg-public-strong/10 text-public-strong/60';
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
