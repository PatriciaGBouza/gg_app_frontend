import { IExpense } from "./iexpense.interface";

export interface IGroup {
    id?: number;
    name: string;
    description: string;
    createdBy: number;
    image: string;
    createdOn: number;
    
}