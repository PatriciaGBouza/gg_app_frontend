import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGroup } from '../interfaces/igroup.interface';
import { GROUPS } from '../db/groups.db';
import { IUser } from '../interfaces/iuser.interface';
import { IParticipant } from '../interfaces/iparticipant.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})


export class GroupsService {
  private httpClient=inject(HttpClient);
  private url = `${environment.apiURL}/groups`;

// hasta API ready
  private arrGroups: IGroup[] = GROUPS
  private lastId:number=5;

  constructor() { }

  /* Devuelve los grupos creados por un usuario*/
  getAllGroupsByUser(aUser:IUser):  Observable<IGroup[]> {
    return this.httpClient.get<IGroup[]>(`${this.url}/creator/${aUser.id}`);
    //return this.httpClient.get<IApiResponse<IGroup[]>>(`${this.url}/creator/${creatorId}`);

    //return this.arrGroups.filter(group => group.createdBy === aUser.id);
  }

  /* Devuelve un grupo concreto*/
  getById(id_param: number):IGroup|undefined {
    return this.arrGroups.find(({id}) => id === id_param);
  }

  
  /* Devuelve participantes dentro de un grupo */
  getAllParticipantsWithinAGroup(aUser:IUser, aGroup:IGroup): IParticipant[]|undefined{
    return this.arrGroups.find(({id}) => id === aGroup.id)?.participants;
  }

  insert(aGroup:IGroup, arrParticipants: IParticipant[], aUser:IUser): IGroup{
    this.lastId++;
    const theNewGroup = {id:this.lastId, name: aGroup.name, description: aGroup.description, image:aGroup.image, createdBy:aUser.id, createdOn:new Date(),participants: arrParticipants};
    this.arrGroups.push(theNewGroup);
    return theNewGroup;
  }

  update(aGroup:IGroup, arrParticipants: IParticipant[],  aUser:IUser): IGroup{
    return aGroup;
  }

  delete (id: number){

  }





  /* cuando API ready
getAllGroups(): Observable<IApiResponse<IGroup[]>> {
    return this.httpClient.get<IApiResponse<IGroup[]>>(this.url);
  }

  getGroupById(id: number): Observable<IApiResponse<IGroup>> {
    return this.httpClient.get<IApiResponse<IGroup>>(`${this.url}/${id}`);
  }

  getGroupsByCreatorId(creatorId: number): Observable<IApiResponse<IGroup[]>> {
    return this.httpClient.get<IApiResponse<IGroup[]>>(`${this.url}/creator/${creatorId}`);
  }

  addGroup(group: IGroup): Observable<IApiResponse<IGroup>> {
    return this.httpClient.post<IApiResponse<IGroup>>(this.url, group);
  }

  updateGroup(group: IGroup): Observable<IApiResponse<IGroup>> {
    return this.httpClient.put<IApiResponse<IGroup>>(`${this.url}/${group.id}`, group);
  }

  deleteGroup(id: number): Observable<IApiResponse<IGroup>> {
    return this.httpClient.delete<IApiResponse<IGroup>>(`${this.url}/${id}`);
  }

  getGroupStateByGroupId(groupId: number): Observable<IApiResponse<any>> {
    return this.httpClient.get<IApiResponse<any>>(`${this.url}/${groupId}/state`);
  }

  activateGroup(groupId: number): Observable<IApiResponse<any>> {
    return this.httpClient.post<IApiResponse<any>>(`${this.url}/${groupId}/activate`, {});
  }
   
    */
}
