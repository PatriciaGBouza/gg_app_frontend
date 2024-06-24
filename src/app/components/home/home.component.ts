import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GroupsService } from '../../services/groups.service';

import { CarouselModule } from 'primeng/carousel';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ChartModule} from 'primeng/chart';

import { IExpense } from '../../interfaces/iexpense.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { IUser } from '../../interfaces/iuser.interface';

import { BalanceComponent } from '../balance/balance.component';
import { IApiResponse } from '../../interfaces/iapi-response';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,PanelModule,CarouselModule, TagModule, ChartModule, BalanceComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit{

    groupsService = inject(GroupsService);
    userService = inject(UserService);
  
  expenses: IExpense[]=[];
  groupsInfo: IGroup[]=[];

  user: IUser = {} as IUser;;

  //CARROUSEL DATA
  responsiveOptions: any[] | undefined;
  
  ngOnInit() {
    this.user = this.userService.getUserFromLocalStorage();
    if (this.user) {
      this.groupsService.getAllGroupsByUser(this.user).subscribe({
        next: (response: IApiResponse<IGroup[]>) => {
          this.groupsInfo = response.data;
          this.expenses = [];

          this.responsiveOptions = [
            {
              breakpoint: '1400px',
              numVisible: 3,
              numScroll: 3
            },
            {
              breakpoint: '1220px',
              numVisible: 2,
              numScroll: 2
            },
            {
              breakpoint: '1100px',
              numVisible: 1,
              numScroll: 1
            }
          ];
        },
        error: (error) => {
          console.error('Error fetching groups:', error);
        }
      });
    } else {
      console.error('User not found in local storage');
    }
  }

 

getExpenseStatus(status: string) {
  switch (status) {
    case 'Paid':
        return 'success';
    case 'Reported':
        return 'info';
    case 'Accepted':
        return 'warning';
    case 'Rechazado':
        return 'warning';
  } 
  return 'info';
}

}
