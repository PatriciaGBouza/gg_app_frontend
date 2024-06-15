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

  getAllGroupsByUser(aUser:IUser): IGroup[] {
    return this.arrGroups.filter(group => group.createdBy === aUser.id);
  }

  getById(id_param: number):IGroup|undefined {
    return this.arrGroups.find(({id}) => id === id_param);
  }


  insert(aGroup:IGroup, participants: IParticipant[], aUser:IUser): IGroup{
    this.lastId++;
    aGroup.id=this.lastId;
    aGroup.createdBy=aUser.id;
    aGroup.createdOn=new Date();
    aGroup.participants=participants;
    this.arrGroups.push(aGroup);
    return aGroup;
  }

  update(aGroup:IGroup, aUser:IUser): IGroup{
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
