import { Injectable, inject } from '@angular/core';
import { IExpense, IExpenseBasicData } from '../interfaces/iexpense.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { IApiResponse } from '../interfaces/iapi-response';
import { Observable } from 'rxjs';
import { IResponseId } from '../interfaces/iapi-responseId';
import { IUser } from '../interfaces/iuser.interface';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})


export class ExpensesService {
  private httpClient = inject(HttpClient);
  private url = `${environment.apiURL}/expenses`;

  // hasta API ready
  //private arrExpenses: IExpense[]= EXPENSES;


  constructor(private userService: UserService) { }

  getAllExpensesByGroup(idGroup: number): Observable<IApiResponse<IExpense[]>>{
    return this.httpClient.get<IApiResponse<IExpense[]>>(`${this.url}/group/${idGroup}`);
  }

  getAllExpensesByUser(user: IUser): Observable<IApiResponse<IExpense[]>>{
    return this.httpClient.get<IApiResponse<IExpense[]>>(`${this.url}/users/${user.id}`);
  }

  /* Devuelve un gasto concreto */
  /* Usado desde el formulario de gasto*/
  getById(id_param: number):  Observable<IApiResponse<IExpense>> {
    return this.httpClient.get<IApiResponse<IExpense>>(`${this.url}/${id_param}`);
  }

  /* Crea un nuevo gasto */
  insert(aExpense:IExpense, aGroupId:number, aPayer:number): Observable<IApiResponse<IResponseId>>{
    let expensedateStr:any;
    try{
      expensedateStr=aExpense.expenseDate?.toISOString().slice(0,10);
    }catch (e){expensedateStr=""};
    let maxdateStr:any;
    try{
      maxdateStr=aExpense.maxDate?.toISOString().slice(0,10);
    }catch (e){maxdateStr=""};

    const theNewExpense:IExpenseBasicData = {groups_id: aGroupId, concept: aExpense.concept, amount:aExpense.amount, expenseDate:expensedateStr, maxDate:maxdateStr, image:aExpense.image, paidBy: aPayer};
    console.log('expensesService.insert with BODY '+ JSON.stringify(theNewExpense));
    return this.httpClient.post<IApiResponse<IResponseId>>(`${this.url}`,theNewExpense);
  }
  
  update(aExpense:IExpense, aGroupId:number, aPayer:number): Observable<IApiResponse<null>>{
    let expensedateStr:any;
    try{
      expensedateStr=aExpense.expenseDate?.toISOString().slice(0,10);
    }catch (e){expensedateStr=""};
    let maxdateStr:any;
    try{
      maxdateStr=aExpense.maxDate?.toISOString().slice(0,10);
    }catch (e){maxdateStr=""};
    
    const theExpense:IExpenseBasicData = {groups_id: aGroupId, concept: aExpense.concept, amount:aExpense.amount, expenseDate:expensedateStr, maxDate:maxdateStr, image:aExpense.image, paidBy: aPayer};
    console.log('expensesService.update with BODY '+ JSON.stringify(theExpense));
    return this.httpClient.put<IApiResponse<null>>(`${this.url}/update/${aExpense.id}`,theExpense);
  }
//### Delete Expense by expense_id DELETE {{HOST}}/api/expenses/:groups_id/:expenses_id

delete(groupId: number, expenseId: number): Observable<IApiResponse<any>> {
  return this.httpClient.delete<IApiResponse<any>>(`${this.url}/${groupId}/${expenseId}`);
}

  // paying your expense assignment
  private userId = this.userService.getUserIdFromLocalStorage();

  payExpenseAssignment(expenses_id: number, groups_id: number, cost: number, status: string): Observable<IApiResponse<any>> {
    const payload = {
      users_id: this.userId,
      expenses_id,
      groups_id,
      cost,
      status
    };
    return this.httpClient.post<IApiResponse<any>>(`${this.url}/payment`, payload);
  }
  // to get personal amount and status of expense_assignment
  // getExpenseById(expenseId: number): Observable<{ personalAmount: number, personalStatus: string }> {
  //   return this.httpClient.get<IApiResponse<IExpense>>(`${this.url}/${expenseId}`).pipe(
  //     map(response => {
  //       const participant = response.data.participants.find(p => p.idParticipant === this.userId);
  //       return {
  //         personalAmount: participant ? participant.amount : 0,
  //         personalStatus: participant ? participant.expenseStatus : 'Not Paid'
  //       };
  //     })
  //   );
  // }
  




 

}