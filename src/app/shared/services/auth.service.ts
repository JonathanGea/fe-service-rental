import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, LoginRequest } from '../models/auth.model';

const ACCESS_TOKEN_KEY = 'auth_token';
const TOKEN_TYPE_KEY = 'auth_token_type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiBaseUrl}api/auth/login`, payload)
      .pipe(
        map((response) => {
          if (!response?.isSuccess || !response.data?.accessToken) {
            throw new Error(this.extractResponseMessage(response));
          }
          return response.data;
        }),
        tap((data) => {
          this.setToken(data.accessToken, data.tokenType);
        }),
        catchError((error) => throwError(() => new Error(this.extractHttpErrorMessage(error))))
      );
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getTokenType(): string | null {
    return localStorage.getItem(TOKEN_TYPE_KEY);
  }

  private setToken(token: string, tokenType: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    if (tokenType) {
      localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
    }
  }

  private clearToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
  }

  private extractResponseMessage(response?: ApiResponse<unknown> | null): string {
    const errors =
      response?.errors
        ?.filter(Boolean)
        .map((error) => (typeof error === 'string' ? error : JSON.stringify(error))) ?? [];
    if (errors.length > 0) {
      return errors.join(', ');
    }
    return 'Login gagal. Silakan periksa email dan password.';
  }

  private extractHttpErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Tidak dapat terhubung ke server. Coba lagi nanti.';
      }
      if (error.status === 401) {
        return 'Email atau password salah.';
      }
      const apiResponse = error.error as ApiResponse<unknown> | null;
      const apiMessage = this.extractResponseMessage(apiResponse);
      if (apiMessage) {
        return apiMessage;
      }
      if (typeof error.error === 'string' && error.error.trim().length > 0) {
        return error.error;
      }
      return error.message || 'Terjadi kesalahan saat login.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Terjadi kesalahan saat login.';
  }
}
