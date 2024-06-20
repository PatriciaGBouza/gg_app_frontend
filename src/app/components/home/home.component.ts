import { Component, inject } from '@angular/core';
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



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,PanelModule,CarouselModule, TagModule, ChartModule, BalanceComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {

  groupsService = inject(GroupsService);
  
  expenses: IExpense[]=[];
  groupsInfo: IGroup[]=[];

  user: IUser={ id: 1};

  //CARROUSEL DATA
  responsiveOptions: any[] | undefined;
  
  ngOnInit() {

    this.groupsService.getAllGroupsByCreatorUser(this.user).subscribe((response: IApiResponse<IGroup[]>) => {
        console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response));
        this.groupsInfo=  response.data;
        this.expenses=[];

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
        ];});
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
