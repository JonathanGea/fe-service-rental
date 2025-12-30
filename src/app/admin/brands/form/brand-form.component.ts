import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandService } from '../../../shared/services/brand.service';
import { BrandRequest, BrandResponse } from '../../../shared/models/brand.model';

@Component({
  selector: 'app-brand-form-page',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './brand-form.component.html'
})
export class BrandFormPageComponent {
  private readonly brandService = inject(BrandService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  brandId: string | null = null;

  readonly brandForm = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.brandId = id;
      this.loadBrand(id);
    }
  }

  loadBrand(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.brandService
      .getBrand(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (brand) => {
          this.patchForm(brand);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  submitForm(): void {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = this.buildPayload();
    const request$ = this.isEditMode && this.brandId
      ? this.brandService.updateBrand(this.brandId, payload)
      : this.brandService.createBrand(payload);

    request$
      .pipe(
        finalize(() => {
          this.isSaving = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/brands']);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  private patchForm(brand: BrandResponse): void {
    this.brandForm.patchValue({
      name: brand.name
    });
  }

  private buildPayload(): BrandRequest {
    const value = this.brandForm.value;
    return {
      name: value.name ?? ''
    };
  }
}
