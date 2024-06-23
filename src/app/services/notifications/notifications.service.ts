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

  constructor(private http: HttpClient, private userService: UserService) { }

  getNotifications(): Observable<IApiResponse<any>> {
    const userId = this.userService.getUserIdFromLocalStorage();
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/${userId}`);
  }
}
