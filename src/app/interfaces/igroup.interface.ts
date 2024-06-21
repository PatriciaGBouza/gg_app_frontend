import { IParticipant, IParticipantInvitations } from "./iparticipant.interface";

export interface IGroup {
    id?: number;
    name: string;
    description: string;
    createdBy: number;
    image: string;
    createdOn: Date;
    participants?: IParticipant[];
    
}

export interface IGroupBasicData {
    id?: number;
    name: string;
    description: string;
    image: string;
 
}

export interface IGroupInvitations {
    participants?: IParticipantInvitations[];
}



