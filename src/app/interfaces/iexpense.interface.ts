import { IGroup } from "./igroup.interface";

export interface IExpense {
    id?: number;
    group:IGroup;
    concept: string;
    amount: number;
    createdBy: number;
    date: number;
    maxDate:number;
    image: string;
    createdOn: number;
    status:string;
}
