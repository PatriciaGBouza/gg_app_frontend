import { Injectable, inject } from '@angular/core';
import { IExpense } from '../interfaces/iexpense.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IApiResponse } from '../interfaces/iapi-response';
import { Observable } from 'rxjs';
import { IResponseId } from '../interfaces/iapi-responseId';


@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private httpClient = inject(HttpClient);
  private url = `${environment.apiURL}/expenses`;

  // hasta API ready
  //private arrExpenses: IExpense[]= EXPENSES;


  constructor() { }

  getAllExpensesByGroup(idGroup: number): Observable<IApiResponse<IExpense[]>>{
    return this.httpClient.get<IApiResponse<IExpense[]>>(`${this.url}/group/${idGroup}`);
  
  }

  /* Devuelve un gasto concreto */
  /* Usado desde el formulario de gasto*/
  getById(id_param: number):  Observable<IApiResponse<IExpense>> {
    return this.httpClient.get<IApiResponse<IExpense>>(`${this.url}/${id_param}`);
  }

  /* Crea un nuevo gasto */
  insert(aExpense:IExpense): Observable<IApiResponse<IResponseId>>{
    //const theNewGroup:IGroupBasicData = {name: aGroup.name, description: aGroup.description, image:aGroup.image};
    console.log('groupsService.insert with BODY '+ JSON.stringify(aExpense));
   return this.httpClient.post<IApiResponse<IResponseId>>(`${this.url}`,aExpense);
  }
  
  update(aExpense:IExpense): Observable<IApiResponse<null>>{
    //const theGroup:IGroupBasicData = {id: aGroup.id,name: aGroup.name, description: aGroup.description, image:aGroup.image};
    console.log('groupsService.update with BODY '+ JSON.stringify(aExpense));
    return this.httpClient.put<IApiResponse<null>>(`${this.url}/${aExpense.expense_id}`,aExpense);
  }

  delete(id: number): Observable<IApiResponse<any>> {
    return this.httpClient.delete<IApiResponse<any>>(`${this.url}/${id}`);
  }

 

}