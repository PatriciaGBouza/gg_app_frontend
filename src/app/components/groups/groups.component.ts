import { Component , inject} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IGroup } from '../../interfaces/igroup.interface';
import { IUser } from '../../interfaces/iuser.interface';


@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterLink, MatTableModule,MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})

export class GroupsComponent {

  groupsService= inject(GroupsService);

  displayedColumns: string[] = ['name', 'description', 'options'];
  groupsInfo: IGroup[]|any;

  /*logged user, TO_DO, to be changed */
  user: IUser={ id: 8};

  ngOnInit(){
    this.groupsService.getAllGroupsByUser(this.user).subscribe((data: IGroup[]) => {
      console.log("groupsService.getAllGroups returned "+ JSON.stringify(data));
      this.groupsInfo=  data;
    
    console.log(this.groupsInfo);
  });
}

 }
