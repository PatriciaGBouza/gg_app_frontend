import { Component, inject } from '@angular/core';

import { CarouselModule } from 'primeng/carousel';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { IExpense } from '../../interfaces/iexpense.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { GroupsService } from '../../services/groups.service';
import { IUser } from '../../interfaces/iuser.interface';
import {ChartModule} from 'primeng/chart';
import { BalanceComponent } from '../balance/balance.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelModule,CarouselModule, TagModule, ChartModule, BalanceComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {
  groupsService = inject(GroupsService);
  
  expenses: IExpense[]=[];
  groupsInfo: IGroup[]=[];

  user: IUser={ id: 1};

  //carrousel
  responsiveOptions: any[] | undefined;
  
  ngOnInit() {

    /*this.groupsService.getAllGroupsByUser(this.user).then((groups) => {
     this.groups = groups;
    });*/
    
    this.groupsInfo=this.groupsService.getAllGroupsByUser(this.user);
    console.log(" ngOnInit groups "+ this.groupsInfo);
    console.log(this.groupsInfo);
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
    ];
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
