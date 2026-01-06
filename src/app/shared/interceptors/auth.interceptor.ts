import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.logout();

        const currentUrl = router.url;
        const isAdminRoute = currentUrl.startsWith('/admin');
        const isLoginRoute = currentUrl.startsWith('/admin/login');

        if (isAdminRoute && !isLoginRoute) {
          router.navigate(['/admin/login'], {
            queryParams: { returnUrl: currentUrl }
          });
        }
      }

      return throwError(() => error);
    })
  );
};
