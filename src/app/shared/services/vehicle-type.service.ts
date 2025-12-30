import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { VehicleTypeRequest, VehicleTypeResponse } from '../models/vehicle-type.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getVehicleTypes(): Observable<VehicleTypeResponse[]> {
    return this.http
      .get<ApiResponse<VehicleTypeResponse[]>>(`${environment.apiBaseUrl}api/vehicle-types`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal memuat data tipe kendaraan.');
          }
          return response.data ?? [];
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  getVehicleType(id: string): Observable<VehicleTypeResponse> {
    return this.http
      .get<ApiResponse<VehicleTypeResponse>>(`${environment.apiBaseUrl}api/vehicle-types/${id}`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memuat detail tipe kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  createVehicleType(payload: VehicleTypeRequest): Observable<VehicleTypeResponse> {
    return this.http
      .post<ApiResponse<VehicleTypeResponse>>(`${environment.apiBaseUrl}api/vehicle-types`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal membuat tipe kendaraan.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  updateVehicleType(id: string, payload: VehicleTypeRequest): Observable<VehicleTypeResponse> {
    return this.http
      .put<ApiResponse<VehicleTypeResponse>>(`${environment.apiBaseUrl}api/vehicle-types/${id}`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memperbarui tipe kendaraan.');
          }
          return response.data;
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
      return error.message || 'Terjadi kesalahan saat memuat data tipe kendaraan.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Terjadi kesalahan saat memuat data tipe kendaraan.';
  }
}
