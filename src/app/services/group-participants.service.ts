import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IParticipant } from '../interfaces/iparticipant.interface';
import { PARTICIPANTS_INAGROUP, PARTICIPANTS_CONTACTSOFAUSER } from '../db/participants.db';
import { IUser } from '../interfaces/iuser.interface';
import { IGroup } from '../interfaces/igroup.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupParticipantsService {

  private httpClient=inject(HttpClient);
  private url="https://localhost/api/groups";

// hasta API ready
  private arrParticipants: IParticipant[] = PARTICIPANTS_CONTACTSOFAUSER;
  private lastId:number=5;

 
    

  constructor() { }

  /* Devuelve todos los participantes que comparten grupo con el usuario que se le pasa por parámetro*/
  getAllAvailableParticipants(aUser:IUser): IParticipant[] {
    return PARTICIPANTS_CONTACTSOFAUSER;
  }
 
  getAllAvailableParticipantsTreeNode(aUser:IUser) {
    return Promise.resolve(this.getAllAvailableParticipants(aUser));
  }

  
  getAllParticipantsWithinAGroup(aUser:IUser, aGroup:IGroup): IParticipant[]{
    return PARTICIPANTS_INAGROUP;

  }


}
