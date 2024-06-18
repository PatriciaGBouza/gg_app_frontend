import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { LoadingService } from '../services/loading.service';
import { IdTransformationService } from '../services/id-transformation.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const idTransformationService = inject(IdTransformationService);

  const token = authService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const modifiedReq = authReq.clone({
    body: idTransformationService.transformObjectIds(authReq.body)
  });

  loadingService.showLoadingSpinner();

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);
      return throwError(() => new Error(error.message));
    }),
    finalize(() => loadingService.hideLoadingSpinner())
  );
};
