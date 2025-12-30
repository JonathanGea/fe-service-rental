import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { VehicleRequest, VehicleResponse, VehicleStatusRequest } from '../models/vehicle.model';
import { AuthService } from './auth.service';
import { VehiclePhotoResponse, VehiclePhotoUpdateRequest } from '../models/vehicle-photo.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getVehicles(status?: string, query?: string): Observable<VehicleResponse[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (query) {
      params = params.set('q', query);
    }

    return this.http
      .get<ApiResponse<VehicleResponse[]>>(`${environment.apiBaseUrl}api/vehicles`, {
        params,
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal memuat data kendaraan.');
          }
          return response.data ?? [];
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }


  getVehicle(id: string): Observable<VehicleResponse> {
    return this.http
      .get<ApiResponse<VehicleResponse>>(`${environment.apiBaseUrl}api/vehicles/${id}`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memuat detail kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  createVehicle(payload: VehicleRequest): Observable<VehicleResponse> {
    return this.http
      .post<ApiResponse<VehicleResponse>>(`${environment.apiBaseUrl}api/vehicles`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal membuat kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  updateVehicle(id: string, payload: VehicleRequest): Observable<VehicleResponse> {
    return this.http
      .put<ApiResponse<VehicleResponse>>(`${environment.apiBaseUrl}api/vehicles/${id}`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memperbarui kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<Record<string, unknown>>>(
        `${environment.apiBaseUrl}api/vehicles/${id}`,
        {
          headers: this.buildAuthHeaders()
        }
      )
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal menghapus kendaraan.');
          }
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  updateStatus(id: string, payload: VehicleStatusRequest): Observable<VehicleResponse> {
    return this.http
      .patch<ApiResponse<VehicleResponse>>(
        `${environment.apiBaseUrl}api/vehicles/${id}/status`,
        payload,
        {
          headers: this.buildAuthHeaders()
        }
      )
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memperbarui status kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  listPhotos(vehicleId: string): Observable<VehiclePhotoResponse[]> {
    return this.http
      .get<ApiResponse<VehiclePhotoResponse[]>>(
        `${environment.apiBaseUrl}api/vehicles/${vehicleId}/photos`,
        {
          headers: this.buildAuthHeaders()
        }
      )
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal memuat foto kendaraan.');
          }
          return response.data ?? [];
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  uploadPhoto(vehicleId: string, file: File, caption?: string): Observable<VehiclePhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();
    if (caption) {
      params = params.set('caption', caption);
    }

    return this.http
      .post<ApiResponse<VehiclePhotoResponse>>(
        `${environment.apiBaseUrl}api/vehicles/${vehicleId}/photos`,
        formData,
        {
          headers: this.buildAuthHeaders(),
          params
        }
      )
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal mengunggah foto kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  updatePhoto(
    vehicleId: string,
    photoId: string,
    payload: VehiclePhotoUpdateRequest
  ): Observable<VehiclePhotoResponse> {
    return this.http
      .patch<ApiResponse<VehiclePhotoResponse>>(
        `${environment.apiBaseUrl}api/vehicles/${vehicleId}/photos/${photoId}`,
        payload,
        {
          headers: this.buildAuthHeaders()
        }
      )
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memperbarui foto kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  deletePhoto(vehicleId: string, photoId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<Record<string, unknown>>>(
        `${environment.apiBaseUrl}api/vehicles/${vehicleId}/photos/${photoId}`,
        {
          headers: this.buildAuthHeaders()
        }
      )
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal menghapus foto kendaraan.');
          }
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const tokenType = this.authService.getTokenType() || 'Bearer';
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `${tokenType} ${token}`
    });
  }

  private extractHttpErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Tidak dapat terhubung ke server. Coba lagi nanti.';
      }
      if (error.status === 401) {
        return 'Sesi login berakhir. Silakan login ulang.';
      }
      const apiResponse = error.error as ApiResponse<unknown> | null;
      if (apiResponse?.errors?.length) {
        return apiResponse.errors.join(', ');
      }
      if (typeof error.error === 'string' && error.error.trim().length > 0) {
        return error.error;
      }
      return error.message || 'Terjadi kesalahan saat memuat data kendaraan.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Terjadi kesalahan saat memuat data kendaraan.';
  }
}
