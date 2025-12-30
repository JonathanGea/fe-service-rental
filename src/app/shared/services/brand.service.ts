import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { BrandRequest, BrandResponse } from '../models/brand.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getBrands(): Observable<BrandResponse[]> {
    return this.http
      .get<ApiResponse<BrandResponse[]>>(`${environment.apiBaseUrl}api/brands`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess) {
            throw new Error('Gagal memuat data brand.');
          }
          return response.data ?? [];
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  getBrand(id: string): Observable<BrandResponse> {
    return this.http
      .get<ApiResponse<BrandResponse>>(`${environment.apiBaseUrl}api/brands/${id}`, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memuat detail brand.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  createBrand(payload: BrandRequest): Observable<BrandResponse> {
    return this.http
      .post<ApiResponse<BrandResponse>>(`${environment.apiBaseUrl}api/brands`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal membuat brand.');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  updateBrand(id: string, payload: BrandRequest): Observable<BrandResponse> {
    return this.http
      .put<ApiResponse<BrandResponse>>(`${environment.apiBaseUrl}api/brands/${id}`, payload, {
        headers: this.buildAuthHeaders()
      })
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data) {
            throw new Error('Gagal memperbarui brand.');
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
      return error.message || 'Terjadi kesalahan saat memuat data brand.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Terjadi kesalahan saat memuat data brand.';
  }
}
