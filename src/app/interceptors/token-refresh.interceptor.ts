import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authToken = authService.getToken();

  function addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  if (authToken && authService.isTokenExpired(authToken)) {
    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        authService.setToken(response.accessToken);
        const clonedReq = addAuthHeader(req, response.accessToken);
        return next(clonedReq);
      }),
      catchError(err => {
        // Token refresh failure (log out the user)
        authService.logout();
        router.navigate(['/login']);
        return next(req);
      })
    );
  }

  return next(req);
};
