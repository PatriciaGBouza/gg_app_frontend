import { Injectable, inject } from '@angular/core';
import { IExpense } from '../interfaces/iexpense.interface';
import { IUser } from '../interfaces/iuser.interface';
import { EXPENSES } from '../db/expense.db';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private httpClient = inject(HttpClient);
  private url = `${environment.apiURL}/expenses`;

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

  /* desde API
  getAllExpensesByGroup(idGroup: number): Observable<IApiResponse<IExpense[]>> {
    return this.httpClient.get<IApiResponse<IExpense[]>>(`${this.url}/group/${idGroup}`);
  }

  getAllExpensesWithinUserGroups(idUser: number): Observable<IApiResponse<IExpense[]>> {
    return this.httpClient.get<IApiResponse<IExpense[]>>(`${this.url}/users/${idUser}`);
  }

  getById(id: number): Observable<IApiResponse<IExpense>> {
    return this.httpClient.get<IApiResponse<IExpense>>(`${this.url}/${id}`);
  }

  insert(expense: IExpense): Observable<IApiResponse<IExpense>> {
    return this.httpClient.post<IApiResponse<IExpense>>(this.url, expense);
  }
    update(expense: IExpense): Observable<IApiResponse<IExpense>> {
    return this.httpClient.put<IApiResponse<IExpense>>(`${this.url}/${expense.id}`, expense);
  }

  delete(id: number): Observable<IApiResponse<any>> {
    return this.httpClient.delete<IApiResponse<any>>(`${this.url}/${id}`);
  }

  
  */



}