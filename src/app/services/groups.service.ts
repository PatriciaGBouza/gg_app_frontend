import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGroup } from '../interfaces/igroup.interface';
import { GROUPS } from '../db/groups.db';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})


export class GroupsService {
  private httpClient=inject(HttpClient);
  private url="https://localhost/api/groups";

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


  insert(aGroup:IGroup, aUser:IUser): IGroup{
    this.lastId++;
    aGroup.id=this.lastId;
    aGroup.createdBy=aUser.id;
    this.arrGroups.push(aGroup);
    return aGroup;
  }

  update(aGroup:IGroup, aUser:IUser): IGroup{
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
