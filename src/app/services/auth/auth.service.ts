import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { ILoginCredentials } from '../../interfaces/auth/ilogin-credentials';
import { IRegistrant } from '../../interfaces/auth/iregistrant';
import { IApiResponse } from '../../interfaces/iapi-response';
import { IRegisterResponse } from '../../interfaces/auth/iregister-response';
import { IAuthResponse } from '../../interfaces/auth/iauth-response';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiURL}/auth`;
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {}

  // Token management
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }
//should it be only private???
  private decodeToken(token: string): any {
    return jwtDecode(token);
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return parseInt(decoded.id, 10);
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  refreshToken(): Observable<IApiResponse<any>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<IApiResponse<any>>(`${this.baseUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response: IApiResponse<any>) => {
        this.handleAuthResponse(response.data);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.router.navigate(['']);
  }

  // Login and registration management
  register(userData: IRegistrant): Observable<IApiResponse<IRegisterResponse>> {
    return this.http.post<IApiResponse<IRegisterResponse>>(`${this.baseUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: ILoginCredentials): Observable<IApiResponse<IAuthResponse>> {
    return this.http.post<IApiResponse<IAuthResponse>>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: IApiResponse<IAuthResponse>) => this.handleAuthResponse(response.data)),
      catchError(this.handleError)
    );
  }

  private handleAuthResponse(data: any): void {
    this.setToken(data.accessToken);  // data.accessToken
    if (data.refreshToken) {
      this.setRefreshToken(data.refreshToken);
    }
    localStorage.setItem('currentUser', JSON.stringify(data.user));  // Store user data
  }

  private handleError(error: any): Observable<never> {
    console.error('Achtung!:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
