import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { IApiResponse } from '../interfaces/iapi-response';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiURL}/users`;

  constructor(private http: HttpClient, private userStateService: UserStateService) {}
// WHEN use is logged in it save up his data in local storage 
/*
Stored user data: {"id":7,"name":"admin","email":"admin@gmail.com","image_url":"https://picsum.photos/id/8/200","state":"Active"}
*/
  getUserFromLocalStorage(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  getUserIdFromLocalStorage(): any {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id;
      console.log('Retrieved user ID:', userId);
      return user.id;
    }
    return null;
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

  // updateUser(user: any): Observable<IApiResponse<any>> {
  //   return this.http.put<IApiResponse<any>>(`${this.baseUrl}/${user.id}`, user);
  // }
  updateUser(user: any): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(`${this.baseUrl}/${user.id}`, user).pipe(
      tap((response: IApiResponse<any>) => {
        this.updateLocalStorage(user); // Update localStorage after successful update
      })
    );
  }
  private updateLocalStorage(updatedData: any): void {
    const currentUser = this.getUserFromLocalStorage();
    if (currentUser) {
      const mergedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(mergedUser));
      this.userStateService.setUser(mergedUser); 
      console.log('Updated localStorage with user:', mergedUser);
    } else {
      console.log('No current user found in localStorage.');
    }
  }

  deleteUser(userId: string): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.baseUrl}/${userId}`).pipe(
      tap(() => {
        this.userStateService.clearUser(); // Clear user state and localStorage
      }))
  }
}
