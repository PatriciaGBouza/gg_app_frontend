import {Component , inject} from '@angular/core';
import { RouterLink } from '@angular/router';

import { GroupsService } from '../../services/groups.service';
import { UserService } from '../../services/user.service';

import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { IGroup } from '../../interfaces/igroup.interface';
import { IApiResponse } from '../../interfaces/iapi-response';


import { catchError } from 'rxjs';
import GlobalErrorHandler from '../../utils/GlobalErrorHandler';




@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterLink, MatTableModule,MatButtonModule, MatMenuModule, MatIconModule, MatSnackBarModule],
  providers: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})

export class GroupsComponent {

  user:any;

  userService=inject(UserService);
  groupsService= inject(GroupsService);

  displayedColumns: string[] = ['name', 'description', 'options'];
  groupsInfo: IGroup[]|any;

  aSnackBar: MatSnackBar;

  constructor( private snackBar: MatSnackBar){
    this.aSnackBar=snackBar;
  }


  ngOnInit(){
    this.user = this.userService.getUserFromLocalStorage();
    this.groupsService.getAllGroupsByCreatorUser(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup[]>) => {
      console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response));
      this.groupsInfo=  response.data;
    },
    (error) => {
      console.error('Error handler:', error);
      this.aSnackBar.open(`Error al cargar grupos. Por favor, contacte con el administrador.`, 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    });
 }


 deleteGroup(groupId?:string|any){
   console.log("groupsService.delete");
   this.groupsService.delete(Number.parseInt(groupId)).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<any>) => {
    console.log("groupsService.delete returned "+ JSON.stringify(response));
  },
  (error) => {
    console.error('Error handler:', error);
    this.aSnackBar.open(`Error al borrar grupos. Por favor, contacte con el administrador.`, 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  });
  }


 }
