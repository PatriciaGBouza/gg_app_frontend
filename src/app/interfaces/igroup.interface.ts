import { IParticipant } from "./iparticipant.interface";

export interface IGroup {
    id?: number;
    name: string;
    description: string;
    createdBy: number;
    image: string;
    createdOn: Date;
    participants?: IParticipant[];
    
}

export interface IExistingGroup {
    id: number;
    name: string;
    description: string;
    createdBy: number;
    image: string;
    createdOn: Date;
    participants?: IParticipant[];
    
}
