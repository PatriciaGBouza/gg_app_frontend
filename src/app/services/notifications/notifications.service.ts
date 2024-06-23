import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../../interfaces/iapi-response';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = `${environment.apiURL}/notifications`;

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(this.baseUrl);
  }
}
