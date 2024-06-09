import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IParticipant } from '../interfaces/iparticipant.interface';
import { PARTICIPANTS_TREEDATA } from '../db/participants.db';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupParticipantsService {

  private httpClient=inject(HttpClient);
  private url="https://localhost/api/groups";

// hasta API ready
  private arrParticipants: IParticipant[] = PARTICIPANTS_TREEDATA;
  private lastId:number=5;

 
    

  constructor() { }

  getAllAvailableParticipants(aUser:IUser): any[] {
    return PARTICIPANTS_TREEDATA;
  }
  
  getAllAvailableParticipantsTreeNode(aUser:IUser) {
    return Promise.resolve(this.getAllAvailableParticipants(aUser));
  }

    


}
