import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IExistingGroup, IGroup } from '../interfaces/igroup.interface';
import { GROUPS } from '../db/groups.db';
import { IUser } from '../interfaces/iuser.interface';
import { IParticipant } from '../interfaces/iparticipant.interface';

@Injectable({
  providedIn: 'root'
})


export class GroupsService {
  private httpClient=inject(HttpClient);
  private url="https://localhost/api/groups";

// hasta API ready
  private arrGroups: IExistingGroup[] = GROUPS
  private lastId:number=5;

  constructor() { }

  /* Devuelve los grupos creados por un usuario*/
  getAllGroupsByUser(aUser:IUser): IExistingGroup[] {
    return this.arrGroups.filter(group => group.createdBy === aUser.id);
  }

  /* Devuelve un grupo concreto*/
  getById(id_param: number):IGroup|undefined {
    return this.arrGroups.find(({id}) => id === id_param);
  }

  
  /* Devuelve participantes dentro de un grupo */
  getAllParticipantsWithinAGroup(aUser:IUser, aGroup:IExistingGroup): IParticipant[]|undefined{
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
  getAllGroups(): Observable<IGroup>{
    return this.httpClient.get<IGroup>(this.url);
  }

  
  getById(id: number): Observable<IGroup>{
    return this.httpClient.get<IGroup>(`${this.url}/${id}`);

  }

  delete(id:number): Observable<IGroup>{
    return this.httpClient.delete<IGroup>(`${this.url}/${id}`);
  }
  
  insert(aGroup:IGroup): Observable<IGroup>{
    return this.httpClient.post<IGroup>(this.url, aGroup);
  }

  update(aGroup:IGroup){
    return this.httpClient.put<IGroup>(`${this.url}/${aGroup.id}`,aGroup);
  }*/
}
