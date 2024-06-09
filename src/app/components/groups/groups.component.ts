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

  user: IUser={ id: 1};

  ngOnInit(){
    this.groupsInfo=this.groupsService.getAllGroupsByUser(this.user);
    //console.log(this.groupsInfo);
  }

 /* ngOnInit() {
    this.groupsService.getAllGroups().subscribe() => {
        console.log("groupsService.getAllGroups returned "+ JSON.stringify(data));
        this.groupsInfo=data;
        
    });
  }*/
}
