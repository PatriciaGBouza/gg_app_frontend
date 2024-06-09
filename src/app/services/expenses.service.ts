import { Injectable } from '@angular/core';
import { IExpense } from '../interfaces/iexpense.interface';
import { EXPENSES } from '../db/expenses.db';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private arrExpenses: IExpense[]= EXPENSES;
  private lastId:number=2;


  constructor() { }

  getAllExpensesByGroup(idGroup: number){
    return this.arrExpenses.filter(expense => expense.group.id === idGroup);
  }

  /* TO-DO: Devuelve la lista de gastos de los grupos a los que pertenece un usuario.*/
  /* ahora no filtra*/
  getAllExpensesWithinUserGroups(idUser: IUser){
    return this.arrExpenses;
  }

  getById(id_param: number):IExpense|undefined {
    return this.arrExpenses.find(({id}) => id === id_param);
  }


  insert(aExpense:IExpense, aUser:IUser): IExpense{
    this.lastId++;
    aExpense.id=this.lastId;
    aExpense.createdBy=aUser.id;
    aExpense.createdOn=new Date();
    this.arrExpenses.push(aExpense);
    return aExpense;
  }

  update(aExpense:IExpense, aUser:IUser): IExpense{
    return aExpense;
  }

  delete (id: number){

  }


}
