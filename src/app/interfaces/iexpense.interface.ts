import { IGroup } from "./igroup.interface";


export interface IExpense {
    id?: number;
    group:IGroup;
    concept: string;
    amount: number;
    expenseDate?: Date;
    maxDate?:Date;
    image?: string;
    paidBy?: number;
    createdOn?: Date;
    expenseStatus?:string;
    participants?: IExpenseParticipant[];
    myAmount?: number;
    myStatus?: string;
  
}

export interface IExpenseBasicData {
    id?: number;
    groups_id:number;
    concept: string;
    amount: number;
    expenseDate?: string;
    maxDate?:string;
    image?: string;
    paidBy?: number;
    createdOn?: Date;
    expenseStatus?:string;
    participants?: IExpenseParticipant[]
  
}


export interface IExpenseParticipant{ 
    idParticipant:number, 
    participantName: string,  
    participantImage?: string,  
    percentage?: number,  
    amount?:number;
    expenseStatus?:string
}






