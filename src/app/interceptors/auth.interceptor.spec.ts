import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth/auth.service';
import { AuthServiceMock } from '../services/auth/auth.service.mock';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let authServiceMock: AuthServiceMock;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useValue: router }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService) as unknown as AuthServiceMock;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header', () => {
    const httpClient = TestBed.inject(HttpClient);
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${authServiceMock.getToken()}`);
  });

  it('should refresh token if expired', () => {
    const httpClient = TestBed.inject(HttpClient);
    spyOn(authServiceMock, 'isTokenExpired').and.returnValue(true);
    spyOn(authServiceMock, 'refreshToken').and.callThrough();

    httpClient.get('/test').subscribe();

    const refreshReq = httpMock.expectOne('/api/auth/refresh-token');
    expect(refreshReq.request.method).toBe('POST');
    refreshReq.flush({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: 'new-token',
        refreshToken: 'new-refresh-token'
      }
    });

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer new-token');
  });

  it('should log out user on token refresh failure', () => {
    const httpClient = TestBed.inject(HttpClient);
    spyOn(authServiceMock, 'isTokenExpired').and.returnValue(true);
    spyOn(authServiceMock, 'refreshToken').and.returnValue(throwError('error'));
    spyOn(authServiceMock, 'logout').and.callThrough();

    httpClient.get('/test').subscribe();

    const refreshReq = httpMock.expectOne('/api/auth/refresh-token');
    refreshReq.flush('error', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
