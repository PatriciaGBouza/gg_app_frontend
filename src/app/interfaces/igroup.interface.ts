import { IParticipant } from "./iparticipant.interface";

export interface IGroup {
    id?: number;
    name: string;
    description: string;
    createdBy: number;
    image_url: string;
    createdOn: Date;
    participants?: IParticipant[];
    
}

export interface IGroupBasicData {
    id?: number;
    name: string;
    description: string;
    image_url: string;
 
}

export interface IGroupInvitations {
    participants?: IParticipant[];
}

