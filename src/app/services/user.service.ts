import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiURL}/auth/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('x-access-token', token);
    } else {
      // Handle the case where the token is null, e.g., redirect to login
      console.error('No token found, redirecting to login.');
      // Optionally, you can handle the redirection here
    }
    return headers;
  }

  getUser(userId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/${userId}`, { headers });
  }

  getUserByEmail(email: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/email/${email}`, { headers });
  }

  updateUser(user: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.baseUrl}/${user.id}`, user, { headers });
  }

  deleteUser(userId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/${userId}`, { headers });
  }
}
