import { Component, inject } from '@angular/core';
import { IGroup } from '../../interfaces/igroup.interface';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { GroupsService } from '../../services/groups.service';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterLink,MatTableModule,MatButtonModule, MatMenuModule, MatIconModule, DatePipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  arrGroups: IGroup[]=[];
  expensesInfo: IExpense[]=[];

  expensesServices= inject (ExpensesService);
  groupsServices=inject (GroupsService);

  user: IUser={ id: 1};

  displayedColumns: string[] = ['group', 'concept', 'amount', 'paidBy', 'expenseStatus', 'expenseDate', 'options'];


ngOnInit(){
  this.arrGroups=this.groupsServices.getAllGroupsByUser(this.user);
  this.expensesInfo=this.expensesServices.getAllExpensesWithinUserGroups(this.user);
}


}
