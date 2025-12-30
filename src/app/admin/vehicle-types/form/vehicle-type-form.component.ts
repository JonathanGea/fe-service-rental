import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleTypeService } from '../../../shared/services/vehicle-type.service';
import { VehicleTypeRequest, VehicleTypeResponse } from '../../../shared/models/vehicle-type.model';

@Component({
  selector: 'app-vehicle-type-form-page',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-type-form.component.html'
})
export class VehicleTypeFormPageComponent {
  private readonly vehicleTypeService = inject(VehicleTypeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  vehicleTypeId: string | null = null;

  readonly vehicleTypeForm = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.vehicleTypeId = id;
      this.loadVehicleType(id);
    }
  }

  loadVehicleType(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleTypeService
      .getVehicleType(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (vehicleType) => {
          this.patchForm(vehicleType);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  submitForm(): void {
    if (this.vehicleTypeForm.invalid) {
      this.vehicleTypeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = this.buildPayload();
    const request$ = this.isEditMode && this.vehicleTypeId
      ? this.vehicleTypeService.updateVehicleType(this.vehicleTypeId, payload)
      : this.vehicleTypeService.createVehicleType(payload);

    request$
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/vehicle-types']);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  private patchForm(vehicleType: VehicleTypeResponse): void {
    this.vehicleTypeForm.patchValue({
      name: vehicleType.name
    });
  }

  private buildPayload(): VehicleTypeRequest {
    const value = this.vehicleTypeForm.value;
    return {
      name: value.name ?? ''
    };
  }
}
