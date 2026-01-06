import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RentalService } from '../../../shared/services/rental.service';
import { RentalResponse, RentalReturnRequest } from '../../../shared/models/rental.model';

@Component({
  selector: 'app-rental-return-page',
  standalone: true,
  imports: [DatePipe, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './rental-return.component.html'
})
export class RentalReturnPageComponent {
  private readonly rentalService = inject(RentalService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  rental: RentalResponse | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  readonly returnForm = this.formBuilder.group({
    returnDate: ['', [Validators.required]],
    conditionNotes: ['']
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRental(id);
    } else {
      this.errorMessage = 'ID rental tidak ditemukan.';
    }
  }

  loadRental(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.rentalService
      .getRental(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rental) => {
          this.rental = rental;
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.rental = null;
        }
      });
  }

  submitForm(): void {
    if (!this.rental) {
      return;
    }

    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = this.buildPayload();

    this.rentalService
      .returnRental(this.rental.id, payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/rentals', this.rental?.id]);
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  private buildPayload(): RentalReturnRequest {
    const value = this.returnForm.value;
    return {
      returnDate: value.returnDate ?? '',
      conditionNotes: value.conditionNotes ?? ''
    };
  }
}
