import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../interfaces/iapi-response';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = `${environment.apiURL}/notifications`;
  private userId = this.userService.getUserIdFromLocalStorage();

  constructor(private http: HttpClient, private userService: UserService) { }
  getNotifications(): Observable<IApiResponse<any>> {
    
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/${this.userId}`);
  }

  changeNotificationStatusToRead(notificationId: number): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(`${this.baseUrl}/changestatus/${notificationId}`, {});
  }

  setAllNotificationsToRead(): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(`${this.baseUrl}/changestatus/all/${this.userId}`, {});
  }
  

}
