import { Component, inject } from '@angular/core';
import { IGroup } from '../../interfaces/igroup.interface';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { GroupsService } from '../../services/groups.service';
import { IUser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterLink,MatTableModule,MatButtonModule, MatMenuModule, MatIconModule, DatePipe, ReactiveFormsModule,IconFieldModule,InputIconModule,InputTextModule,DropdownModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  activatedRoute = inject(ActivatedRoute);

  arrGroups: IGroup[]=[];
  expensesInfo: IExpense[]=[];

  expensesService= inject (ExpensesService);
  groupsService=inject (GroupsService);

  searchForm:FormGroup|any;

  user: IUser={ id: 1};

  displayedColumns: string[] = ['group', 'concept', 'amount', 'paidBy', 'expenseStatus', 'expenseDate', 'options'];

  constructor() {
    this.searchForm = new FormGroup({
        selectedGroup: new FormControl(null, [Validators.required])});
    }


ngOnInit(){

  this.activatedRoute.queryParamMap.subscribe((paramMap) => {
    // read param from paramMap
    // TO-DO: TRY TO CHANGE THIS AND REPLACE WITH STATES, also in expense form
    const paramValue = paramMap.get('selectedGroup');
   
    // use parameter...
    let aSelectedGroup=paramValue?parseInt(paramValue):NaN;
    if(!isNaN(aSelectedGroup)){
      console.log('selectedGroup '+ paramValue);
      let aGroup=this.groupsService.getById(aSelectedGroup);
      this.searchForm = new FormGroup({
        selectedGroup: new FormControl(aGroup, [Validators.required])
      });
      
      this.searchData();
    }else{
      this.expensesInfo=this.expensesService.getAllExpensesWithinUserGroups(this.user);
    }

  });
  
  this.groupsService.getAllGroupsByUser(this.user).subscribe((data: IGroup[]) => {
    console.log("groupsService.getAllGroups returned "+ JSON.stringify(data));
    this.arrGroups=  data;
  });

  
  
}

searchData(){
  console.log('ExpensesComponent searchData ' + JSON.stringify(this.searchForm.value));
  const {id}=this.searchForm.value.selectedGroup;
  console.log('ExpensesComponent searchData ' +id);
  this.expensesInfo=this.expensesService.getAllExpensesWithinUserGroupsFilteredByGroup(this.user,id);
}

}
