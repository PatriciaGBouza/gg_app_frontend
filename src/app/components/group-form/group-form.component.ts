import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MatButtonModule} from '@angular/material/button';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { GroupsService } from '../../services/groups.service';
import { IUser } from '../../interfaces/iuser.interface';
import { switchMap } from 'rxjs';
import { StepperModule } from 'primeng/stepper';
import { Message, TreeNode } from 'primeng/api';
import { GroupParticipantsService } from '../../services/group-participants.service';
import { TreeModule } from 'primeng/tree';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, FileUploadModule, TableModule, MatButtonModule,StepperModule,TreeModule ,ToastModule],
  providers: [MessageService],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'  
})



export class GroupFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  parent: string = '';

  groupsService = inject(GroupsService);
  participantsService = inject(GroupParticipantsService);


  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;

  messages: Message[] = [];

  user: IUser={ id: 1};

  selectedId: string|any;


  participants!: TreeNode[];
  selectedParticipants!: TreeNode[];

  invitationsCount=0;

  uploadedFiles: any[] = [];


   /*
   Pattern to verify email addresses. Take a look at match / not match. It works very well. E-mail, email, mail, e-mail address, email address, mail address.
Matches	
john-smith@example.com | john.smith@example.com | john_smith@x-ample.com
Non-Matches	
.john-smith@example.com | @example.com | johnsmith@example.
      */
emailPattern =
'^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$';
/* This regex matches fully qualified external urls (http, https). It uses the ms specific group-naming structure to present friendly named groups back to the user.
Matches	
http://www.myserver.mydomain.com/myfolder/mypage.aspx
Non-Matches	
www.myserver.mydomain.com/myfolder/mypage.aspx*/


  constructor(private messageService: MessageService) {
    this.modelForm = new FormGroup(
      {
        name: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
        inviteEmail: new FormControl(null, [Validators.pattern(this.emailPattern)])
      },
      []
    );
      this.isEmptyForm = true;
 
      this.messageService=messageService;
      
  }
  

  ngOnInit(){

    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      // read param from paramMap
      // TO-DO: TRY TO CHANGE THIS AND REPLACE WITH STATES, also in expense form
      const paramValue = paramMap.get('parent');
      console.log('parent '+ paramValue);
      // use parameter...


      this.participants = this.participantsService.getAllAvailableParticipants(this.user);
      this.selectedParticipants=[];
      this.invitationsCount=0;

    });

    

    this.activatedRoute.params.subscribe((params: any) => {
      let selectedId = params.id;
      //console.log(" ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {
        //case: edit group
      if(isNaN(selectedId)){
          this.messages.push(
            { severity: 'error', summary: 'Error', detail: 'Por favor, contacte con el administrador' }
          );
       } else{
        let aGroup =this.groupsService.getById(Number.parseInt(selectedId));
        //console.log(" ngOnInit edit "+ aGroup?.name);
        if (aGroup && aGroup.id){
          this.isEmptyForm = false;
          let mykeys=['53'];
          this.preselectParticipants(mykeys);
          this.modelForm = new FormGroup(
            {
              id: new FormControl(aGroup.id, []),
              name: new FormControl(aGroup.name, [Validators.required]),
              description: new FormControl(aGroup.description, [Validators.required]),
              inviteEmail: new FormControl("", [ Validators.pattern(this.emailPattern)])
            },
            []
          );
        }else{
          this.messages.push(
            { severity: 'error', summary: 'Error cargando datos de grupo', detail: 'Por favor, contacte con el administrador' }
          );
        }

       /* 
        /* cuando API ready
       this.groupsService.getById(selectedId).subscribe((data: IGroup) => {
          console.log(
            'groupsService.getById returned ' + JSON.stringify(data)
          );
          let aGroup = data;
          if (aGroup.id){
            this.isEmptyForm = false;
            this.modelForm = new FormGroup(
              {
                id: new FormControl(aGroup.id, []),
                name: new FormControl(aGroup.name, [Validators.required]),
                description: new FormControl(aGroup.description, [Validators.required])
                
              },
              []
            );
          }else{
            this.messages.push(
            { severity: 'error', summary: 'Error cargando datos de grupo', detail: 'Por favor, contacte con el administrador' }
          );
          }
        });*/
       }
      }
    });
  }
 
      
 preselectParticipants(keys: string[]){
  console.log('Preselect participants ' +keys);
  this.preselectNodes(keys,this.participants);
 }


 sendInvitation(){
  console.log('Send Invitation '+ this.modelForm.value.inviteEmail);
  
  let newNode = {
    key: 'TOBEADDED'+this.invitationsCount,
    label:  this.modelForm.value.inviteEmail + ' (Invitar)',
    data:  this.modelForm.value.inviteEmail,
    icon: '',
    children: [
    ]
  };
  this.selectedParticipants.push(newNode);
  this.participants.unshift(newNode);
  this.messageService.add(
    { severity: 'info', summary: 'Email añadido correctamente', detail: 'Email ' +  this.modelForm.value.inviteEmail +  ' añadido correctamente' , key: 'br', life: 3000 }
  );
  this.modelForm.get('inviteEmail').reset();
  this.invitationsCount++;
 
 }
   

  validateField(
    formControlName: string,
    validator: string
  ): boolean | undefined {
    return (
      this.modelForm.get(formControlName)?.hasError(validator) &&
      this.modelForm.get(formControlName)?.touched
    );
  }

  emailEmpty(){
    let value=this.modelForm.get('inviteEmail').value;
    return (value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0));
    
  }

  

  saveFormData(): void {
  
   if (this.modelForm.value.id) {
      console.log(' saveFormData update');
      //update
      let aGroup = this.groupsService.update(this.modelForm.value, this.user);
     /* this.groupsService
        .update(this.modelForm.value)
        .subscribe((data: IGroup) => {
          console.log('groupsService.update returned ' + JSON.stringify(data));
          let aGroup = data;
          */
          if (aGroup.id) {
            this.messageService.add(
              { severity: 'success', summary: 'Grupo actualizado correctamente', detail: 'Grupo ' +  aGroup.id +  ' ' + aGroup.name +  ' ' +  aGroup.description + ' actualizado correctamente' , key: 'br', life: 3000  }
            );
          
            this.modelForm.reset();
            this.router.navigate(['/groups']);
          } else {
            this.messages.push(
              { severity: 'error', summary: 'Error durante la actualización', detail: 'Por favor, contacte con el administrador' }
            )
          }
        /* });*/
    } else {
      console.log('saveFormData insert');
      //insert
      console.log('selected part' + this.selectedParticipants);
        let aGroup = this.groupsService.insert(this.modelForm.value, [], this.user);
        /*.subscribe((data: IGroup) => {
          console.log('groupsService.insert returned ' + JSON.stringify(data));
          let aGroup = data;*/

          if (aGroup.id) {
            this.messageService.add(
              { severity: 'success', summary: 'Grupo creado correctamente', detail: 'Nuevo grupo ' +  aGroup.id +  ' ' + aGroup.name +  ' ' +  aGroup.description + ' creado correctamente' , key: 'br', life: 3000 }
            );
            
            this.modelForm.reset();
            this.router.navigate(['/groups']);
          } else {
            this.messages.push(
              { severity: 'error', summary: 'Error durante la creación', detail: 'Por favor, contacte con el administrador' }
            )
          }
       /* });*/
   /* }*/
  }
  }

  isTreeNode = (item: TreeNode | undefined): item is TreeNode => { return !!item }

  preselectNodes(keys: string[], allNodes: TreeNode[]): void {
    this.selectedParticipants = keys.map(key => this.getNodeWithKey(key, allNodes)).filter(this.isTreeNode);
  }

  

  getNodeWithKey(key: string, nodes: TreeNode[]): TreeNode | undefined {
    for (let node of nodes) {
     
      if (node.key === key) {
          return node;
      }
 
      if (node.children) {
        let matchedNode = this.getNodeWithKey(key, node.children);
        if (matchedNode) {
          return matchedNode;
        }
      }
    }
    return undefined;
 }


 onUpload(event:FileUploadEvent) {
  for(let file of event.files) {
      this.uploadedFiles.push(file);
  }

  this.messageService.add({severity: 'info', summary: 'Fichero subido', detail: ''});
}

 showBottomRight() {
  this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', key: 'br', life: 3000 });
}
 
}
