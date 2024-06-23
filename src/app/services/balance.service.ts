import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { IApiResponse } from '../interfaces/iapi-response';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private baseUrl = `${environment.apiURL}`;
  private userId = this.userService.getUserIdFromLocalStorage();

  constructor(private http: HttpClient, private userService: UserService) {}

  getBalance(groupId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${this.baseUrl}/expenses/balance/${this.userId}/${groupId}`);
  }
//return only groups where there data of balance, if debt, payed and total are 0, it will not be included
  getAllGroupsByUser(): Observable<{ id: number, name: string }[]> {
    return this.http.get<IApiResponse<{ id: number, name: string }[]>>(`${this.baseUrl}/groups/user/${this.userId}`).pipe(
      map(response => response.data),
      mergeMap(groups => {
        const balanceChecks = groups.map(group => this.getBalance(group.id).pipe(
          map(balanceResponse => ({ ...group, balance: balanceResponse.data }))
        ));
        return forkJoin(balanceChecks);
      }),
      map(groupsWithBalance => groupsWithBalance.filter(group => 
        group.balance.cantDebida > 0 || group.balance.cantPagada > 0 || group.balance.amountTotal > 0
      )),
      map(groupsWithBalance => groupsWithBalance.map(group => ({ id: group.id, name: group.name })))
    );
  }

  


}
