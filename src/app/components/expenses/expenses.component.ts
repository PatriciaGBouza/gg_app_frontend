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
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../services/user.service';
import { IApiResponse } from '../../interfaces/iapi-response';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [RouterLink,MatTableModule,MatButtonModule, MatMenuModule, MatIconModule, DatePipe, ReactiveFormsModule,IconFieldModule,InputIconModule,InputTextModule,DropdownModule],
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

  displayedColumns: string[] = ['concept', 'amount', 'payer_user_id', 'date', 'max_date', 'options'];

  arrGroups: IGroup[]=[];
  expensesInfo: IExpense[]=[];



  constructor() {
    this.searchForm = new FormGroup({
        selectedGroup: new FormControl(null, [Validators.required])});
  }


  ngOnInit(){

      this.user = this.userService.getUserFromLocalStorage();
      this.activatedRoute.queryParamMap.subscribe((paramMap) => {

        const paramValue = paramMap.get('selectedGroup');

        let aSelectedGroup=paramValue?parseInt(paramValue):NaN;
        if(!isNaN(aSelectedGroup)){
          console.log('selectedGroup '+ paramValue);
          let aGroup=this.groupsService.getById(aSelectedGroup);
          this.searchForm = new FormGroup({
            selectedGroup: new FormControl(aGroup, [Validators.required])
          });
          this.searchData();
        }

      });
      
      this.groupsService.getAllGroupsByUser(this.user).subscribe((response: IApiResponse<IGroup[]>) => {
        console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response));
        this.arrGroups=  response.data;
      });
  
}

searchData(){
    console.log('ExpensesComponent searchData ' + JSON.stringify(this.searchForm.value));
    if(this.searchForm.value.selectedGroup!=null) {
      const {id}=this.searchForm.value.selectedGroup;
      console.log('ExpensesComponent searchData ' +id);

      this.expensesService.getAllExpensesByGroup(id).subscribe((response: IApiResponse<IExpense[]>) => {
        console.log("expensesService.getAllExpensesByGroup returned "+ JSON.stringify(response));
        this.expensesInfo=  response.data;
      });
      
    }
}

}
