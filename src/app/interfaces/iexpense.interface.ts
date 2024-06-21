import { IGroup } from "./igroup.interface";


export interface IExpense {
    expense_id?: number;
    groups_id:number;
    concept: string;
    amount: number;
    date?: Date;
    max_date?:Date;
    image_url?: string;
    payer_user_id?: number;
    createdOn: Date;
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






