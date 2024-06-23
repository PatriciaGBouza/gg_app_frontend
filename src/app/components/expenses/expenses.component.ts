import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { IGroup } from '../../interfaces/igroup.interface';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { GroupsService } from '../../services/groups.service';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../services/user.service';
import { IApiResponse } from '../../interfaces/iapi-response';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import GlobalErrorHandler from '../../utils/GlobalErrorHandler';
//
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterLink,MatTableModule,MatButtonModule, MatMenuModule, MatIconModule, DatePipe, ReactiveFormsModule,IconFieldModule,InputIconModule,InputTextModule,DropdownModule,MatSnackBarModule, CommonModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})

export class ExpensesComponent {
  activatedRoute = inject(ActivatedRoute);

  user:any;

  expensesService= inject (ExpensesService);
  groupsService=inject (GroupsService);
  userService=inject(UserService);

  searchForm:FormGroup|any;

  displayedColumns: string[] = ['concept', 'amount', 'paidBy', 'expenseDate', 'maxDate','expenseStatus', 'Tu parte','Tu estado','options'];

  arrGroups: IGroup[]=[];
  expensesInfo: IExpense[]=[];

  aSnackBar: MatSnackBar;

  constructor( private snackBar: MatSnackBar) {
    this.searchForm = new FormGroup({
        selectedGroup: new FormControl(null, [])});
    this.aSnackBar=snackBar;
 }


  ngOnInit(){

      this.user = this.userService.getUserFromLocalStorage();


      this.groupsService.getAllGroupsByUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup[]>) => {
        console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response.data));
        this.arrGroups=  response.data;
        
        },
        (error) => {
          console.error('Error handler:', error);
          this.aSnackBar.open('Error al cargar listado de grupos. Por favor, contacte con el administrador.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        });
  
      

      this.activatedRoute.queryParamMap.subscribe((paramMap) => {
        const paramValue = paramMap.get('selectedGroup');

        let aSelectedGroup=paramValue?parseInt(paramValue):NaN;
        if(!isNaN(aSelectedGroup)){
          console.log('selectedGroup '+ paramValue);
          this.groupsService.getById(aSelectedGroup).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup>) => {
            const aGroup=response.data;
            this.searchForm = new FormGroup({
              selectedGroup: new FormControl(aGroup, [])
            });
            this.searchData();
           },
          (error) => {
            console.error('Error handler:', error);
            this.aSnackBar.open('Error al cargar grupo. Por favor, contacte con el administrador.', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }); 
         
        } else{
          this.reloadExpensesDataWithExpensesByUser();
        }

      });
      
    }


    isPayer(paidById: number): boolean {
      return this.user.id === paidById;
    }
  
    isAdmin(group: IGroup): boolean {
      return this.user.id === group.createdBy;
    }

searchData(){
    console.log('ExpensesComponent searchData ' + JSON.stringify(this.searchForm.value));
    this.expensesInfo=[];
    if(this.searchForm.value.selectedGroup!=null) {
     
      const {id}=this.searchForm.value.selectedGroup;
      console.log('ExpensesComponent searchData ' +id);

      this.expensesService.getAllExpensesByGroup(id).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IExpense[]>) => {
        console.log("expensesService.getAllExpensesByGroup returned "+ JSON.stringify(response));
        this.expensesInfo=  response.data;
      },
      (error) => {
        console.error('Error handler:', error);
        this.aSnackBar.open('Error al cargar gastos del grupo ['+ id + ']: . Por favor, contacte con el administrador.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      });
      
    }else{
      this.reloadExpensesDataWithExpensesByUser();
    }
}

reloadExpensesDataWithExpensesByUser():void{
  this.expensesService.getAllExpensesByUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IExpense[]>) => {
    console.log("expensesService.getAllExpensesByUser returned "+ JSON.stringify(response));
    this.expensesInfo=  response.data;
  },
  (error) => {
    console.error('Error handler:', error);
    this.aSnackBar.open('Error al cargar gastos. Por favor, contacte con el administrador.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  });
}



//paying expense assignment
//I need to send personal expense amount 2.
//show personal expense amount in the table 1.

async updateStatusToPaid(expense: IExpense): Promise<void> {
  const groupId = expense.group?.id;

  console.log('Expense ID:', expense.id);
  console.log('Group ID:', groupId);
  
  if (expense.id == null || groupId == null || expense.myAmount == null) {
    this.aSnackBar.open('ID de gasto o ID de grupo no encontrado.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  try {
    await firstValueFrom(this.expensesService.payExpenseAssignment(expense.id, groupId, expense.myAmount, 'Reported'));
    this.aSnackBar.open('Estado actualizado a "Pagado".', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.searchData();
  } catch (error) {
    console.error('Error handler:', error);
    this.aSnackBar.open('Error al actualizar el estado. Por favor, contacte con el administrador.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
}

//delete expense

async deleteExpense(expense: IExpense): Promise<void> {
  console.log('Expense Object:', expense); // Debugging statement

  const groupId = expense.group?.id;

  console.log('Expense ID:', expense.id);
  console.log('Group ID:', groupId);

  if (groupId == null || expense.id == null) {
    this.aSnackBar.open('ID de gasto o ID de grupo no encontrado.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    return;
  }

  try {
    await firstValueFrom(this.expensesService.delete(groupId, expense.id));
    this.aSnackBar.open('Gasto eliminado correctamente.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.searchData();
  } catch (error) {
    console.error('Error handler:', error);
    this.aSnackBar.open('Error al eliminar el gasto. Por favor, contacte con el administrador.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
}









}
