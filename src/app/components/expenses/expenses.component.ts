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
import { firstValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SweetAlertService } from '../../services/sweet-alert.service';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterLink,MatTableModule,MatButtonModule, MatMenuModule, MatIconModule, DatePipe, ReactiveFormsModule,IconFieldModule,InputIconModule,InputTextModule,DropdownModule,MatSnackBarModule, CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})

export class ExpensesComponent {
  activatedRoute = inject(ActivatedRoute);

  user:any;

  expensesService= inject (ExpensesService);
  groupsService=inject (GroupsService);
  userService=inject(UserService);
  sweetAlertService = inject(SweetAlertService);

  searchForm:FormGroup|any;

  displayedColumns: string[] = ['concept', 'amount', 'paidBy', 'expenseDate', 'maxDate','expenseStatus', 'Tu parte','Tu estado','options'];

  arrGroups: IGroup[]=[];
  expensesInfo: IExpense[]=[];
  userMap = new Map<number, string>();
  aSnackBar: MatSnackBar;

  constructor( private snackBar: MatSnackBar) {
    this.searchForm = new FormGroup({
        selectedGroup: new FormControl(null, [])});
    this.aSnackBar=snackBar;
 }


 async ngOnInit(): Promise<void> {
  this.user = this.userService.getUserFromLocalStorage();

  try {
    const response: IApiResponse<IGroup[]> = await firstValueFrom(
      this.groupsService.getAllGroupsByUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction))
    );
    console.log("groupsService.getAllGroupsByUser returned " + JSON.stringify(response.data));
    this.arrGroups = response.data;
  } catch (error) {
    console.error('Error handler:', error);
    this.aSnackBar.open('Error al cargar listado de grupos. Por favor, contacte con el administrador.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }

  this.activatedRoute.queryParamMap.subscribe(async (paramMap) => {
    const paramValue = paramMap.get('selectedGroup');

    let aSelectedGroup = paramValue ? parseInt(paramValue) : NaN;
    if (!isNaN(aSelectedGroup)) {
      console.log('selectedGroup ' + paramValue);

      try {
        const response: IApiResponse<IGroup> = await firstValueFrom(
          this.groupsService.getById(aSelectedGroup).pipe(catchError(GlobalErrorHandler.catchErrorFunction))
        );
        const aGroup = response.data;
        this.searchForm = new FormGroup({
          selectedGroup: new FormControl(aGroup, [])
        });
        await this.searchData();
      } catch (error) {
        console.error('Error handler:', error);
        this.aSnackBar.open('Error al cargar grupo. Por favor, contacte con el administrador.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    } else {
      await this.reloadExpensesDataWithExpensesByUser();
    }
  });
}
async loadUserNames() {
  for (let expense of this.expensesInfo) {
    if (expense.paidBy !== undefined && !this.userMap.has(expense.paidBy)) {
      const response = await firstValueFrom(this.userService.getUserById(expense.paidBy.toString()));
      this.userMap.set(expense.paidBy, response.data.name);
    }
  }
}

// with subsribe
  // ngOnInit(){

  //     this.user = this.userService.getUserFromLocalStorage();


  //     this.groupsService.getAllGroupsByUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup[]>) => {
  //       console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response.data));
  //       this.arrGroups=  response.data;
        
  //       },
  //       (error) => {
  //         console.error('Error handler:', error);
  //         this.aSnackBar.open('Error al cargar listado de grupos. Por favor, contacte con el administrador.', 'Cerrar', {
  //           duration: 3000,
  //           panelClass: ['snackbar-error']
  //         });
  //       });
  
      

  //     this.activatedRoute.queryParamMap.subscribe((paramMap) => {
  //       const paramValue = paramMap.get('selectedGroup');

  //       let aSelectedGroup=paramValue?parseInt(paramValue):NaN;
  //       if(!isNaN(aSelectedGroup)){
  //         console.log('selectedGroup '+ paramValue);
  //         this.groupsService.getById(aSelectedGroup).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup>) => {
  //           const aGroup=response.data;
  //           this.searchForm = new FormGroup({
  //             selectedGroup: new FormControl(aGroup, [])
  //           });
  //           await this.searchData();
  //          },
  //         (error) => {
  //           console.error('Error handler:', error);
  //           this.aSnackBar.open('Error al cargar grupo. Por favor, contacte con el administrador.', 'Cerrar', {
  //             duration: 3000,
  //             panelClass: ['snackbar-error']
  //           });
  //         }); 
         
  //       } else{
  //         this.reloadExpensesDataWithExpensesByUser();
  //       }

  //     });
      
  //   }

    async searchData(): Promise<void> {
      console.log('ExpensesComponent searchData ' + JSON.stringify(this.searchForm.value));
      this.expensesInfo = [];
      if (this.searchForm.value.selectedGroup != null) {
        const { id } = this.searchForm.value.selectedGroup;
        console.log('ExpensesComponent searchData ' + id);
    
        try {
          const response: IApiResponse<IExpense[]> = await firstValueFrom(
            this.expensesService.getAllExpensesByGroup(id).pipe(catchError(GlobalErrorHandler.catchErrorFunction))
          );
          console.log("expensesService.getAllExpensesByGroup returned " + JSON.stringify(response));
          this.expensesInfo = response.data;
          await this.loadUserNames();
          console.log('User Map:', this.userMap);
        } catch (error) {
          console.error('Error handler:', error);
          this.aSnackBar.open('Error al cargar gastos del grupo [' + id + ']: . Por favor, contacte con el administrador.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      } else {
        await this.reloadExpensesDataWithExpensesByUser();
      }
    }
    

// searchData with subscribe
// searchData(){
//     console.log('ExpensesComponent searchData ' + JSON.stringify(this.searchForm.value));
//     this.expensesInfo=[];
//     if(this.searchForm.value.selectedGroup!=null) {
     
//       const {id}=this.searchForm.value.selectedGroup;
//       console.log('ExpensesComponent searchData ' +id);

//       this.expensesService.getAllExpensesByGroup(id).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IExpense[]>) => {
//         console.log("expensesService.getAllExpensesByGroup returned "+ JSON.stringify(response));
//         this.expensesInfo=  response.data;
//       },
//       (error) => {
//         console.error('Error handler:', error);
//         this.aSnackBar.open('Error al cargar gastos del grupo ['+ id + ']: . Por favor, contacte con el administrador.', 'Cerrar', {
//           duration: 3000,
//           panelClass: ['snackbar-error']
//         });
//       });
      
//     }else{
//       this.reloadExpensesDataWithExpensesByUser();
//     }
// }

//reload without subscribe and with async

async reloadExpensesDataWithExpensesByUser(): Promise<void> {
  try {
    const response: IApiResponse<IExpense[]> = await firstValueFrom(
      this.expensesService.getAllExpensesByUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction))
    );
    console.log("expensesService.getAllExpensesByUser returned " + JSON.stringify(response));
    this.expensesInfo = response.data;
    await this.loadUserNames();
    console.log('User Map:', this.userMap);
  } catch (error) {
    console.error('Error handler:', error);
    this.aSnackBar.open('Error al cargar gastos. Por favor, contacte con el administrador.', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
}
// reload with subscribe
// reloadExpensesDataWithExpensesByUser():void{
//   this.expensesService.getAllExpensesByUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IExpense[]>) => {
//     console.log("expensesService.getAllExpensesByUser returned "+ JSON.stringify(response));
//     this.expensesInfo=  response.data;
//     this.loadUserNames();
//     console.log('User Map:', this.userMap);
//   },
//   (error) => {
//     console.error('Error handler:', error);
//     this.aSnackBar.open('Error al cargar gastos. Por favor, contacte con el administrador.', 'Cerrar', {
//       duration: 3000,
//       panelClass: ['snackbar-error']
//     });
//   });
// }


//conditions for showing or hiding

isPayer(paidById: number): boolean {
  return this.user.id === paidById;
}

isAdmin(group: IGroup): boolean {
  return this.user.id === group.createdBy;
}


isPaid(status: string): boolean {
return status === 'Paid';
}

showOptions(expense: IExpense): boolean {
  const paidBy = expense.paidBy ?? 0;
  const myStatus = expense.myStatus ?? 'Not Paid';
  return this.isAdmin(expense.group) || (!this.isPayer(paidBy) && !this.isPaid(myStatus));
}
// get name for paidBy



//paying expense assignment
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

  const result = await this.sweetAlertService.confirm('¿Está seguro de que desea marcar este gasto como pagado?');
  if (result.isConfirmed) {
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
}

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

  const result = await this.sweetAlertService.confirm('¿Está seguro de que desea eliminar este gasto?');
  if (result.isConfirmed) {
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
}
