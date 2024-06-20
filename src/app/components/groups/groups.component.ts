import {Component , inject} from '@angular/core';
import { RouterLink } from '@angular/router';

import { GroupsService } from '../../services/groups.service';
import { UserService } from '../../services/user.service';

import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


import { IGroup } from '../../interfaces/igroup.interface';
import { IApiResponse } from '../../interfaces/iapi-response';


import { catchError } from 'rxjs';
import GlobalErrorHandler from '../../utils/GlobalErrorHandler';

import { Message, MessageService } from 'primeng/api';


@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterLink, MatTableModule,MatButtonModule, MatMenuModule, MatIconModule],
  providers: [MessageService],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})

export class GroupsComponent {

  user:any;

  userService=inject(UserService);
  groupsService= inject(GroupsService);

  displayedColumns: string[] = ['name', 'description', 'options'];
  groupsInfo: IGroup[]|any;

  messages: Message[] = [];

  constructor(private messageService: MessageService){
    this.messageService=messageService;
  }


  ngOnInit(){
    this.user = this.userService.getUserFromLocalStorage();
    this.groupsService.getAllGroupsByCreatorUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup[]>) => {
      console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response));
      this.groupsInfo=  response.data;
    },
    (error) => {
      console.error('Error handler:', error);
    });
 }


 deleteGroup(groupId?:string|any){
   console.log("groupsService.delete");
   this.groupsService.delete(Number.parseInt(groupId)).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<any>) => {
    console.log("groupsService.delete returned "+ JSON.stringify(response));
  },
  (error) => {
    console.error('Error handler:', error);
  });
  }


 }
