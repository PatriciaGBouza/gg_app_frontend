import { Injectable } from '@angular/core';
import { IExpense } from '../interfaces/iexpense.interface';
import { IUser } from '../interfaces/iuser.interface';
import { EXPENSES } from '../db/expense.db';


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

  /* Devuelve toda la lista de gastos de los grupos a los que pertenece un usuario.*/
  /* Usado desde pantalla de listado de gastos */
  getAllExpensesWithinUserGroups(idUser: IUser){
    return this.arrExpenses;
  }

  /* Devuelve toda la lista de gastos de un grupo al que pertenece un usuario */

  getAllExpensesWithinUserGroupsFilteredByGroup(idUser: IUser, idGroup:number):IExpense[]{
    return this.arrExpenses.filter(({group}) => group.id === idGroup);
  }

  /* Devuelve un gasto concreto */
  /* Usado desde el formulario de gasto*/
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