import { IGroup } from "./igroup.interface";


export interface IExpense {
    id?: number;
    group:IGroup;
    concept: string;
    amount: number;
    paidBy?: number;
    createdBy: number;
    expenseDate?: Date;
    maxDate?:Date;
    image?: string;
    createdOn: Date;
    expenseStatus:string;
    participants: IExpenseParticipant[]
   
}


export interface IExpenseParticipant{ 
    idParticipant:number, 
    participantName: string,  
    participantImage?: string,  
    percentage?: number,  
    amount?:number;
    expenseStatus?:string
}






