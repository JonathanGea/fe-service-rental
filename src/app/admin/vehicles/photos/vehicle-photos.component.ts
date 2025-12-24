import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../../shared/services/vehicle.service';
import { VehiclePhotoResponse } from '../../../shared/models/vehicle-photo.model';

interface PhotoDraft {
  caption: string;
  order: number | null;
}

@Component({
  selector: 'app-vehicle-photos-page',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './vehicle-photos.component.html'
})
export class VehiclePhotosPageComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  vehicleId = '';
  photos: VehiclePhotoResponse[] = [];
  drafts: Record<string, PhotoDraft> = {};
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  uploadCaption = '';
  isUploading = false;
  updatingPhotoId: string | null = null;
  deletingPhotoId: string | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleId = id;
      this.loadPhotos();
    } else {
      this.errorMessage = 'ID kendaraan tidak ditemukan.';
    }
  }

  loadPhotos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vehicleService
      .listPhotos(this.vehicleId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (photos) => {
          this.photos = photos;
          this.drafts = {};
          photos.forEach((photo) => {
            this.drafts[photo.id] = {
              caption: photo.caption ?? '',
              order: photo.order ?? null
            };
          });
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
          this.photos = [];
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  uploadPhoto(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Pilih file foto terlebih dahulu.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';

    this.vehicleService
      .uploadPhoto(this.vehicleId, this.selectedFile, this.uploadCaption.trim())
      .pipe(
        finalize(() => {
          this.isUploading = false;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.selectedFile = null;
          this.uploadCaption = '';
          this.loadPhotos();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  updateDraft(photoId: string, field: keyof PhotoDraft, value: string): void {
    const draft = this.drafts[photoId] ?? { caption: '', order: null };
    this.drafts[photoId] = {
      ...draft,
      [field]: field === 'order' ? (value ? Number(value) : null) : value
    };
  }

  savePhoto(photoId: string): void {
    const draft = this.drafts[photoId];
    if (!draft) {
      return;
    }

    this.updatingPhotoId = photoId;
    this.errorMessage = '';

    this.vehicleService
      .updatePhoto(this.vehicleId, photoId, {
        caption: draft.caption,
        order: draft.order ?? undefined
      })
      .pipe(
        finalize(() => {
          this.updatingPhotoId = null;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.loadPhotos();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }

  deletePhoto(photoId: string): void {
    this.deletingPhotoId = photoId;
    this.errorMessage = '';

    this.vehicleService
      .deletePhoto(this.vehicleId, photoId)
      .pipe(
        finalize(() => {
          this.deletingPhotoId = null;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.loadPhotos();
        },
        error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
  }
}
