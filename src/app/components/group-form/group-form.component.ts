import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { GroupsService } from '../../services/groups.service';
import { GroupParticipantsService } from '../../services/group-participants.service';

import { MatButtonModule} from '@angular/material/button';
import { StepperModule } from 'primeng/stepper';
import { Message, TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { IParticipant } from '../../interfaces/iparticipant.interface';
import { UserService } from '../../services/user.service';
import { IApiResponse } from '../../interfaces/iapi-response';
import { IResponseId } from '../../interfaces/iapi-responseId';
import { IGroup } from '../../interfaces/igroup.interface';

import { catchError } from 'rxjs';
import GlobalErrorHandler from '../../utils/GlobalErrorHandler';



@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, FileUploadModule, TableModule, MatButtonModule,StepperModule,TreeModule, MatSnackBarModule ],
  providers: [],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'  
})



export class GroupFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  parent: string|any = '';                 
  
  user:any;
  
  /* SERVICES */
  userService=inject(UserService);
  groupsService = inject(GroupsService);
  participantsService = inject(GroupParticipantsService);

  /* REACTIVE FORM */ 
  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;

  //snackBar: MatSnackBar;

  /* DATA for the participants tree and upload files*/
  arrParticipants: IParticipant[]=[]; // the array of all the available participants
  participants: TreeNode[]=[];
  selectedParticipants: TreeNode[]=[]; // the selected participants
  uploadedFiles: any[] = [];


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


  constructor() {
    this.modelForm = new FormGroup(
      {
        name: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
        inviteEmail: new FormControl(null, [Validators.pattern(this.emailPattern)]),
        image_url: new FormControl(null, [Validators.maxLength(255)]),
      },
      []
    );
    this.isEmptyForm = true;
    //this.snackBar=snackBar;
      
      
      
  }
  
 
  ngOnInit(){

    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      this.parent = paramMap.get('parent');
      this.parent ??='home';
    });

     //INICIALIZAMOS DATOS
    this.user = this.userService.getUserFromLocalStorage();
    this.participantsService.getAllAvailableParticipants(this.user).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IParticipant[]>) => {
      console.log('participantsService.getAllAvailableParticipants returned ' + JSON.stringify(response));  
      this.arrParticipants=response.data;
      this.buildTreeNodeData();
      this.selectedParticipants=[];
      this.invitationsCount=0;

    },
        (error) => {
          console.error('Error handler:', error);
          /*this.snackBar.open('Error al eliminar el usuario. Inténtalo de nuevo.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });

          this.messages.push(
             { severity: 'error', summary: 'Error durante la obtención de participantes disponibles', detail: 'Por favor, contacte con el administrador' }
          )*/
          
    });

    //LEEMOS DE PARAMS , PARA VER SI ESTAMOS EN MODO EDICION
    this.activatedRoute.params.subscribe((params: any) => {
      const selectedId = params.id;
      console.log("--> ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {

        //case: edit group
        if(isNaN(selectedId)){
            /*this.messages.push(
              { severity: 'error', summary: 'Error', detail: 'Por favor, contacte con el administrador' }
            );*/
        } else{

           //GET DATOS DE GRUPO
          this.groupsService.getById(Number.parseInt(selectedId)).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup>) => {
              console.log('groupsService.getById returned ' + JSON.stringify(response));
              const aGroup=response.data;
              if (aGroup && aGroup.id){
                this.isEmptyForm = false;
                               
                let keys = aGroup.participants?.map(item => {
                return item.id.toString()
                });
            

                console.log(" ngOnInit edit group where selected participants are [" + keys+"]");

                if(keys!=undefined) this.preselectParticipants(keys);
                this.modelForm = new FormGroup({
                    id: new FormControl(aGroup.id, []),
                    name: new FormControl(aGroup.name, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
                    description: new FormControl(aGroup.description, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
                    inviteEmail: new FormControl("", [ Validators.pattern(this.emailPattern)]),
                    image_url: new FormControl(aGroup.image_url, [Validators.maxLength(255)])
                  },
                  []
                );
          }
          },
          (error) => {
            console.error('Error handler:', error);
            /*this.messages.push(
               { severity: 'error', summary: 'Error durante la obtención de datos de grupo', detail: 'Por favor, contacte con el administrador' }
            )*/
            
          });
                     
       }
      }
    });
      
  }
 
  buildTreeNodeData(){
    console.log('buildTreeNodeData  of '+this.arrParticipants.length +" participants" );
    for (let i=0;i<this.arrParticipants.length;i++){
      //console.log('adding node with participant id  '+this.arrParticipants[i].id.toString());
      let newNode = {
        key: this.arrParticipants[i].id.toString(),
        label:  this.arrParticipants[i].name,
        data:  this.arrParticipants[i].name,
        icon: '',
        children: [ ]
      };
      this.participants.push(newNode);
    }
  }
 
  preselectParticipants(keys: string[]){
    console.log('Check as participant already assigned to group: ' +keys);
    this.preselectNodes(keys,this.participants);
 }


 /* HTML FORM METHODS */
 /* Add invitation from the html form */
  addInvitation(){
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
    /*this.messageService.add(
      { severity: 'info', summary: 'Email añadido correctamente', detail: 'Email ' +  this.modelForm.value.inviteEmail +  ' añadido correctamente' , key: 'br', life: 3000 }
    );*/
    this.modelForm.get('inviteEmail').reset();
    this.invitationsCount++;
 
 }
   
 /* Validate field from the html form */
  validateField(formControlName: string, validator: string ): boolean | undefined {
    return (
      this.modelForm.get(formControlName)?.hasError(validator) &&
      this.modelForm.get(formControlName)?.touched
    );
  }


  emailEmpty(){
    let value=this.modelForm.get('inviteEmail').value;
    return (value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0));
    
  }
  

/* TREE NODE METHODS */

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

/* FILE UPLOAD METHODS */

 onUpload(event:FileUploadEvent) {
  for(let file of event.files) {
      this.uploadedFiles.push(file);
  }

  /*this.messageService.add({severity: 'info', summary: 'Fichero subido', detail: ''});*/
}

/* MESSAGE SERVICE METHODS*/
 showBottomRight() {
  /*this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', key: 'br', life: 3000 });*/
}

/* SAVE FORM DATA */
saveFormData(): void {
  
  if (this.modelForm.value.id) {
     console.log('--> saveFormData update');
       //update
       
       this.groupsService.update(this.modelForm.value).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<null>) => {
           console.log('groupsService.update returned ' + JSON.stringify(response));
           
           this.saveFormDataSendInvitations (this.modelForm.value.id) ;
           this.modelForm.reset();
           console.log(' saveFormData update ' + this.parent); 
           if(this.parent ==='list')
             this.router.navigate(['/groups']);
           else 
             this.router.navigate(['/home']);
         
       },
       (error) => {
         console.error('Error handler:', error);
         /*this.messages.push(
           { severity: 'error', summary: 'Error durante la actualización de grupo', detail: 'Por favor, contacte con el administrador' }
         )*/
       });
   } else {
     console.log('saveFormData insert');
     
       //insert group
       let theNewId:any;
       this.groupsService.insert(this.modelForm.value).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IResponseId>) => {
         console.log('groupsService.insert returned ' + JSON.stringify(response));
         
         theNewId=response.data.id;
         this.saveFormDataSendInvitations (theNewId) ;
                     
       },
        (error) => {
          // This block will only execute if catchError is used
          console.error('Error handler:', error);
          /*this.messages.push(
           { severity: 'error', summary: 'Error durante la creación', detail: 'Por favor, contacte con el administrador' }
         )*/
        });


   }

 }
 
 saveFormDataSendInvitations(idGroup:number){
   //insert invitations
   this.groupsService.insertParticipants(idGroup,this.getArrraySelectedParticipants()).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IResponseId>) => {
     console.log('groupsService.insertParticipants returned ' + JSON.stringify(response));
   
     /*this.messageService.add(
         { severity: 'success', summary: 'Grupo e invitaciones creadas correctamente', detail: 'Grupo e invitaciones creadas correctamente' , key: 'br', life: 3000 }
     );*/
     
     this.modelForm.reset();
     this.router.navigate(['/groups']);
             
     },
     (error) => {
       // This block will only execute if catchError is used
       console.error('Error handler:', error);
       /*this.messages.push(
         { severity: 'error', summary: 'Error durante la creación de invitaciones ', detail: 'Por favor, contacte con el administrador' }
       )*/
     }
   );
}
 

getArrraySelectedParticipants():IParticipant[]{
   const arrPart:IParticipant[]=[];
   for (let selPart of this.selectedParticipants) {
     
     let aSelectedKey=selPart.key;
     if (aSelectedKey!=undefined){
       let iSeletedKey=Number.parseInt(aSelectedKey);
       console.log(' buildArrayParticipantsFromSelected key:'+iSeletedKey);
       let thePart=this.arrParticipants.find(({id}) => id === iSeletedKey );
       console.log(' Saving as participant: '+thePart?.id +' ' +thePart?.name );
       if(thePart!=undefined)
         arrPart.push(thePart);
     }
  }
   return arrPart;
 }
 
}
