import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IApiResponse } from '../interfaces/iapi-response';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})


export class MembershipService {
  private url = `${environment.apiURL}/membership`;



  constructor(private http: HttpClient, private userService: UserService) { }

  deleteMembership(idUser:number, idGroup: number): Observable<IApiResponse<null>>{
    return this.http.delete<IApiResponse<null>>(`${this.url}/${idUser}/${idGroup}`);
  }
  private userId = this.userService.getUserIdFromLocalStorage();

  //accept invitation
  updateMembershipStatusToJoined(groupId: number): Observable<IApiResponse<any>> {
    const url = `${this.url}/${this.userId}/${groupId}`;
    return this.http.put<IApiResponse<any>>(url, {});
  }

  //decline invitation
  refuseInvitation(groupId: number): Observable<IApiResponse<any>> {
    const url = `${this.url}/refuse/${this.userId}/${groupId}`;
    return this.http.delete<IApiResponse<any>>(url);
  }
  // balance total
  getUserBalance(): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.url}/balance`);
  }

  
}
