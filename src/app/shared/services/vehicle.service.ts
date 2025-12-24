import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { VehicleResponse } from '../models/vehicle.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  getVehicles(status?: string): Observable<VehicleResponse[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
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
