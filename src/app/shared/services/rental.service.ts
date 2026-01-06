import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  RentalRequest,
  RentalResponse,
  RentalReturnRequest,
  RentalUpdateRequest
} from '../models/rental.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getRentals(filters?: {
    vehicleId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<RentalResponse[]> {
    let params = new HttpParams();
    if (filters?.vehicleId) {
      params = params.set('vehicleId', filters.vehicleId);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http
      .get<ApiResponse<RentalResponse[]>>(`${environment.apiBaseUrl}api/rentals`, {
        params,
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal memuat data rental.');
          }
          return response.data ?? [];
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  getRentalHistory(filters?: {
    vehicleId?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<RentalResponse[]> {
    let params = new HttpParams();
    if (filters?.vehicleId) {
      params = params.set('vehicleId', filters.vehicleId);
    }
    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http
      .get<ApiResponse<RentalResponse[]>>(`${environment.apiBaseUrl}api/rentals/history`, {
        params,
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal memuat riwayat rental.');
          }
          return response.data ?? [];
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  getRental(id: string): Observable<RentalResponse> {
    return this.http
      .get<ApiResponse<RentalResponse>>(`${environment.apiBaseUrl}api/rentals/${id}`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memuat detail rental.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  createRental(payload: RentalRequest): Observable<RentalResponse> {
    return this.http
      .post<ApiResponse<RentalResponse>>(`${environment.apiBaseUrl}api/rentals`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal membuat rental.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  updateRental(id: string, payload: RentalUpdateRequest): Observable<RentalResponse> {
    return this.http
      .patch<ApiResponse<RentalResponse>>(`${environment.apiBaseUrl}api/rentals/${id}`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memperbarui rental.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  returnRental(id: string, payload: RentalReturnRequest): Observable<RentalResponse> {
    return this.http
      .post<ApiResponse<RentalResponse>>(`${environment.apiBaseUrl}api/rentals/${id}/return`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memproses pengembalian.');
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
      return error.message || 'Terjadi kesalahan saat memuat data rental.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Terjadi kesalahan saat memuat data rental.';
  }
}
