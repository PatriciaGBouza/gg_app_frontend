import { IParticipant } from "./iparticipant.interface";

export interface IGroup {
    id?: number;
    name: string;
    description: string;
    createdBy: number;
    image: string;
    createdOn: number;
    participants: IParticipant[];
    
}