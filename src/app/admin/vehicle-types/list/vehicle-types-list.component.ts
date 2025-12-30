import { Component, DestroyRef, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleTypeService } from '../../../shared/services/vehicle-type.service';
import { VehicleTypeResponse } from '../../../shared/models/vehicle-type.model';

@Component({
  selector: 'app-vehicle-types-list-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './vehicle-types-list.component.html'
})
export class VehicleTypesListPageComponent {
  private readonly vehicleTypeService = inject(VehicleTypeService);
  private readonly destroyRef = inject(DestroyRef);

  vehicleTypes: VehicleTypeResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loadVehicleTypes();
  }

  loadVehicleTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleTypeService
      .getVehicleTypes()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicleTypes) => {
          this.vehicleTypes = vehicleTypes;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.vehicleTypes = [];
        }
      });
  }
}
