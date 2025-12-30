import { Component, DestroyRef, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandService } from '../../../shared/services/brand.service';
import { BrandResponse } from '../../../shared/models/brand.model';

@Component({
  selector: 'app-brands-list-page',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './brands-list.component.html'
})
export class BrandsListPageComponent {
  private readonly brandService = inject(BrandService);
  private readonly destroyRef = inject(DestroyRef);

  brands: BrandResponse[] = [];
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.brandService
      .getBrands()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (brands) => {
          this.brands = brands;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.brands = [];
        }
      });
  }
}
