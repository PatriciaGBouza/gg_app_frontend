import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IParticipant } from '../interfaces/iparticipant.interface';
import { PARTICIPANTS_INAGROUP, PARTICIPANTS_CONTACTSOFAUSER } from '../db/participants.db';
import { IUser } from '../interfaces/iuser.interface';
import { IGroup } from '../interfaces/igroup.interface';
import { IApiResponse } from '../interfaces/iapi-response';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupParticipantsService {

  private httpClient=inject(HttpClient);
  private url = `${environment.apiURL}/users`;


  constructor() { }

  /* Devuelve todos los participantes */
  getAllAvailableParticipants(aUser:IUser):  Observable<IApiResponse<IParticipant[]>> {
    return this.httpClient.get<IApiResponse<IParticipant[]>>(`${this.url}`);
  }
 
  getAllAvailableParticipantsTreeNode(aUser:IUser) {
    return Promise.resolve(this.getAllAvailableParticipants(aUser));
  }



}
