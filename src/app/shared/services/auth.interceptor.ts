import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token();

  // Si hay token y no es la petición de login, agregar Authorization header
  if (token && !req.url.includes('/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar respuesta
  return next(req).pipe(
    catchError(error => {
      // Si el error es 401 (no autorizado), redirigir al login
      if (error.status === 401) {
        console.warn('Token inválido o expirado. Redirigiendo al login...');
        authService.logout().subscribe();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
  // return next(req);
};
