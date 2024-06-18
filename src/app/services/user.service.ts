import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IApiResponse } from '../interfaces/iapi-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.apiURL}/users`;

  constructor(private http: HttpClient) {}

  getUserFromLocalStorage(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
    
  }

  getUserName(): string | null {
    const user = this.getUserFromLocalStorage();
    return user ? user.name : null; 
  }

  getUserById(userId: string): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/${userId}`);
  }

  getUserByEmail(email: string): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/email/${email}`);
  }

  updateUser(user: any): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(`${this.baseUrl}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.baseUrl}/${userId}`);
  }
}
