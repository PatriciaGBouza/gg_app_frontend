import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiURL}/auth`;
  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) {
    // Load user data from local storage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.baseUrl}/login`, credentials).subscribe(
        (response: any) => {
          this.saveToken(response.accessToken);
          this.currentUser = response.user;
          localStorage.setItem('currentUser', JSON.stringify(response.user)); // Store user data in local storage
          console.log('Login response:', response); // Log the entire response
          console.log('Logged in user data:', this.currentUser); // Log user data
          console.log('Access token:', response.accessToken); // Log access token
          this.router.navigate(['/home']);
          observer.next(response);
          observer.complete();
        },
        (error: any) => {
          console.error('Login error:', error);
          observer.error(error);
        }
      );
    });
  }

  getUser(): any {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    return this.currentUser; // Return the saved user details
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); // Remove user data from local storage
    this.router.navigate(['/']);
  }
}
