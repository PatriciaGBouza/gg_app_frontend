import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GroupsService } from '../../services/groups.service';
import { GroupParticipantsService } from '../../services/group-participants.service';

import { MatButtonModule} from '@angular/material/button';
import { StepperModule } from 'primeng/stepper';
import { Message, TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';



import { IUser } from '../../interfaces/iuser.interface';
import { IParticipant } from '../../interfaces/iparticipant.interface';



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

  parent: string|any = '';                 

  
  /* SERVICES */
  groupsService = inject(GroupsService);
  participantsService = inject(GroupParticipantsService);

/* REACTIVE FORM */ 
  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;

  /* DATA for the participants tree and upload files*/
  arrParticipants: IParticipant[]=[];
  participants: TreeNode[]=[];
  selectedParticipants: TreeNode[]=[];
  uploadedFiles: any[] = [];

  messages: Message[] = [];

  /*logged user, TO_DO, to be changed */
  user: IUser={ id: 1};

  invitationsCount=0;

  
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
        name: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
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
      this.parent = paramMap.get('parent');
      this.parent ??='home';

    });

     //INICIALIZAMOS DATOS
    this.arrParticipants=this.participantsService.getAllAvailableParticipants(this.user);
    this.buildTreeNodeData(this.arrParticipants);
    this.selectedParticipants=[];
    this.invitationsCount=0;

    //LEEMOS DE PARAMS , PARA VER SI ESTAMOS EN MODO EDICION
    this.activatedRoute.params.subscribe((params: any) => {

      const selectedId = params.id;
      console.log(" ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {

        //case: edit group
        if(isNaN(selectedId)){
            this.messages.push(
              { severity: 'error', summary: 'Error', detail: 'Por favor, contacte con el administrador' }
            );
        } else{

           //GET DATOS DE GRUPO
          const aGroup =this.groupsService.getById(Number.parseInt(selectedId));
          console.log(" ngOnInit edit "+ JSON.stringify(aGroup));

          if (aGroup && aGroup.id){
            this.isEmptyForm = false;

            const theExistingGroup = {id:aGroup.id, name: aGroup.name, description: aGroup.description, image:aGroup.image, createdBy:aGroup.createdBy, createdOn:aGroup.createdOn,participants: aGroup.participants};
            const arr= this.groupsService.getAllParticipantsWithinAGroup(this.user, theExistingGroup);
            let keys = arr?.map(item => {
             return item.id.toString()
            });
            

            console.log(" ngOnInit edit selected participants are:" + keys);

            if(keys!=undefined) this.preselectParticipants(keys);
            this.modelForm = new FormGroup(
              {
                id: new FormControl(aGroup.id, []),
                name: new FormControl(aGroup.name, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
                description: new FormControl(aGroup.description, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
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
 
  buildTreeNodeData(arrParticipants: IParticipant[]){
    console.log('buildTreeNodeData  of '+arrParticipants.length +" participants" );
    for (let i=0;i<arrParticipants.length;i++){
      console.log('adding node with participant id  '+arrParticipants[i].id.toString());
      let newNode = {
        key: arrParticipants[i].id.toString(),
        label:  arrParticipants[i].name,
        data:  arrParticipants[i].name,
        icon: '',
        children: [ ]
      };
      this.participants.push(newNode);
    }
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
      let aGroup = this.groupsService.update(this.modelForm.value, this.buildArrayParticipantsFromSelected(), this.user);

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
            console.log(' saveFormData update ' + this.parent); 
            if(this.parent ==='list')
              this.router.navigate(['/groups']);
            else 
            this.router.navigate(['/home']);
          } else {
            this.messages.push(
              { severity: 'error', summary: 'Error durante la actualización', detail: 'Por favor, contacte con el administrador' }
            )
          }
        /* });*/
    } else {
      console.log('saveFormData insert');
      //insert
        let aGroup = this.groupsService.insert(this.modelForm.value, this.buildArrayParticipantsFromSelected(), this.user);

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


  buildArrayParticipantsFromSelected():IParticipant[]{
    const arrPart:IParticipant[]=[];
    for (let selPart of this.selectedParticipants) {
      let aSelectedKey=selPart.key;
      if (aSelectedKey!=undefined){
        let iSeletedKey=Number.parseInt(aSelectedKey);
        let thePart=this.arrParticipants.find(({id}) => id === iSeletedKey );
        console.log(' Saving as participant: '+thePart?.id +' ' +thePart?.name );
        if(thePart!=undefined)
          arrPart.push(thePart);
      }
   }
    return arrPart;
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
