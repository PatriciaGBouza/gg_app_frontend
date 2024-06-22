import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { IApiResponse } from '../interfaces/iapi-response';

@Injectable({
  providedIn: 'root'
})


export class MembershipService {
  private httpClient = inject(HttpClient);
  private url = `${environment.apiURL}/membership`;


  constructor() { }

  deleteMembership(idUser:number, idGroup: number): Observable<IApiResponse<null>>{
    return this.httpClient.delete<IApiResponse<null>>(`${this.url}/${idUser}/${idGroup}`);
  }
}
