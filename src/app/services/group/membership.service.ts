import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../interfaces/iapi-response';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private baseUrl = `${environment.apiURL}/membership`;

  constructor(private http: HttpClient) {}

  getAllMemberships(): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(this.baseUrl);
  }

  getMembershipsByGroupId(groupId: string): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/group/${groupId}`);
  }

  addMemberToGroup(memberData: any): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(this.baseUrl, memberData);
  }

  updateMembershipStatus(userId: string, groupId: string): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(`${this.baseUrl}/${userId}/${groupId}`, {});
  }

  getMembership(userId: string, groupId: string): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/${userId}/${groupId}`);
  }

  deleteMembership(userId: string, groupId: string): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.baseUrl}/${userId}/${groupId}`);
  }
}
