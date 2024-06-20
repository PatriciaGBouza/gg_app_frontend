import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGroup, IGroupBasicData, IGroupInvitations } from '../interfaces/igroup.interface';
import { GROUPS } from '../db/groups.db';
import { IUser } from '../interfaces/iuser.interface';
import { IParticipant } from '../interfaces/iparticipant.interface';
import { environment } from '../../environments/environment.development';
import { IApiResponse } from '../interfaces/iapi-response';
import { IResponseId } from '../interfaces/iapi-responseId';

@Injectable({
  providedIn: 'root'
})


export class GroupsService {
  private httpClient=inject(HttpClient);
  private url = `${environment.apiURL}/groups`;

// hasta API ready
  private arrGroups: IGroup[] = GROUPS


  constructor() { }

  /* Devuelve los grupos creados por un usuario*/
  getAllGroupsByCreatorUser(aUser:IUser):  Observable<IApiResponse<IGroup[]>> {
    return this.httpClient.get<IApiResponse<IGroup[]>>(`${this.url}/creator/${aUser.id}`);
  }

  
  /* Devuelve los grupos a los que pertenece un usuario*/
  getAllGroupsByUser(aUser:IUser):  Observable<IApiResponse<IGroup[]>> {
    return this.httpClient.get<IApiResponse<IGroup[]>>(`${this.url}/user/${aUser.id}/groups`);
  }

  /* Devuelve un grupo concreto*/
  getById(id_param: number):  Observable<IApiResponse<IGroup>> {
    return this.httpClient.get<IApiResponse<IGroup>>(`${this.url}/${id_param}`);
  }
  
  /* Devuelve participantes dentro de un grupo */
  getAllParticipantsWithinAGroup(aUser:IUser, aGroup:IGroup): IParticipant[]|undefined{
    return this.arrGroups.find(({id}) => id === aGroup.id)?.participants;
  }

  /* Crea un nuevo grupo */
  insert(aGroup:IGroup): Observable<IApiResponse<IResponseId>>{
    const theNewGroup:IGroupBasicData = {name: aGroup.name, description: aGroup.description, image_url:aGroup.image_url};
    console.log('groupsService.insert with BODY '+ JSON.stringify(theNewGroup));
    return this.httpClient.post<IApiResponse<IResponseId>>(`${this.url}`,theNewGroup);
  }

  /* Invita a participantes en un grupo */
  insertParticipants(idGroup:number, arrParticipants: IParticipant[]): Observable<IApiResponse<IResponseId>>{
    const theInvitations:IGroupInvitations = {participants:arrParticipants};
    console.log('groupsService.insertParticipants with BODY '+ JSON.stringify(theInvitations) +' and idGroup: '+idGroup);
    return this.httpClient.post<IApiResponse<IResponseId>>(`${this.url}/${idGroup}/invite/`,theInvitations);
  }

  /* Actualiza un grupo */
  update(aGroup:IGroup): Observable<IApiResponse<null>>{
    const theGroup:IGroupBasicData = {id: aGroup.id,name: aGroup.name, description: aGroup.description, image_url:aGroup.image_url};
    console.log('groupsService.update with BODY '+ JSON.stringify(theGroup));
    return this.httpClient.put<IApiResponse<null>>(`${this.url}/${aGroup.id}`,theGroup);
  }

  /*Borra un grupo */
  delete (idGroup: number): Observable<IApiResponse<any>>{
    return this.httpClient.delete<IApiResponse<IResponseId>>(`${this.url}/${idGroup}`);
  }


  
}
