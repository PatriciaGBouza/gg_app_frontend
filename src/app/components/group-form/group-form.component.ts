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


import { IParticipant, IParticipantInvitations } from '../../interfaces/iparticipant.interface';
import { UserService } from '../../services/user.service';
import { IApiResponse } from '../../interfaces/iapi-response';
import { IResponseId } from '../../interfaces/iapi-responseId';
import { IGroup } from '../../interfaces/igroup.interface';

import { catchError } from 'rxjs';
import GlobalErrorHandler from '../../utils/GlobalErrorHandler';
import StateTranslation from '../../utils/StateTranslation';



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

  aSnackBar: MatSnackBar;

  /* DATA for the participants tree and upload files*/
  arrParticipants: IParticipant[]=[]; // the array of all the available participants
  participants: TreeNode[]=[];
  selectedParticipants: TreeNode[]=[]; // the selected participants of the tree node
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


  constructor(private snackBar: MatSnackBar) {
    this.modelForm = new FormGroup(
      {
        name: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
        inviteEmail: new FormControl(null, [Validators.pattern(this.emailPattern)]),
        image: new FormControl(null, [Validators.maxLength(255)]),
      },
      []
    );
    this.isEmptyForm = true;
    this.aSnackBar=snackBar;
      
      
      
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
      this.aSnackBar.open('Error al cargar participantes. Por favor, contacte con el administrador.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
              
    });

    //LEEMOS DE PARAMS , PARA VER SI ESTAMOS EN MODO EDICION
    this.activatedRoute.params.subscribe((params: any) => {
      const selectedId = params.id;
      console.log("--> ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {

        //case: edit group
        if(isNaN(selectedId)){
            this.snackBar.open('Error leyendo id de grupo. Por favor, contacte con el administrador', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
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
            
                //ESTE KEYS ES EL QUE USARIA PARA SABER QUÉ ID S TENIA DE INICIO
                console.log(" ngOnInit edit group where selected participants are [" + keys+"]");

                if(keys!=undefined) this.preselectParticipants(keys);
                this.modelForm = new FormGroup({
                    id: new FormControl(aGroup.id, []),
                    name: new FormControl(aGroup.name, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
                    description: new FormControl(aGroup.description, [Validators.required, Validators.minLength(3),Validators.maxLength(255)]),
                    inviteEmail: new FormControl("", [ Validators.pattern(this.emailPattern)]),
                    image: new FormControl(aGroup.image, [Validators.maxLength(255)])
                  },
                  []
                );
            }
          },
          (error) => {
            console.error('Error handler:', error);
            this.aSnackBar.open('Error durante la obtención de datos de grupo. Por favor, contacte con el administrador.', 'Cerrar', {
                duration: 3000,
                panelClass: ['snackbar-error']
            });
          });
                     
       }
      }
    });
      
  }
  
  updateNodeData(key:string, state:string){

  }


  buildTreeNodeData(){
    console.log('buildTreeNodeData  of '+this.arrParticipants.length +" participants" );
    for (let i=0;i<this.arrParticipants.length;i++){
      //console.log('adding node with participant id  '+this.arrParticipants[i].id.toString());
      let newNode = {
        key: this.arrParticipants[i].id.toString(),
        label:  this.arrParticipants[i].name +' ( estado: ' +StateTranslation.getState(this.arrParticipants[i].state) + ' )' ,
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
      key: 'NEWINVITATION'+this.invitationsCount,
      label:  this.modelForm.value.inviteEmail + ' (Invitar)',
      data:  this.modelForm.value.inviteEmail,
      icon: '',
      children: [
      ]
    };
    this.selectedParticipants.push(newNode);
    this.participants.unshift(newNode);

    this.snackBar.open('Email añadido correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    
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

  this.snackBar.open('Fichero añadido correctamente', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-success']
  });
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

          this.aSnackBar.open('Grupo actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-sucess']
          });
          
          console.log(' saveFormData update ' + this.parent); 
          
          if(this.parent ==='list')
            this.router.navigate(['/groups']);
          else 
            this.router.navigate(['/home']);
         
       },
       (error) => {
         console.error('Error handler:', error);
         this.aSnackBar.open('Error durante la actualización de grupo. Por favor, contacte con el administrador.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
          });
        
       });
   } else {
     console.log('--> saveFormData insert');
     
      //insert group
      let theNewId:any;
      this.groupsService.insert(this.modelForm.value).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IResponseId>) => {
        console.log('groupsService.insert returned ' + JSON.stringify(response));
       
        theNewId=response.data.id;
        this.saveFormDataSendInvitations (theNewId) ;
        this.aSnackBar.open('Grupo creado correctamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-sucess']
        });
                     
      },
      (error) => {
          console.error('Error handler:', error);
          this.aSnackBar.open('Error durante la creación de nuevo grupo. Por favor, contacte con el administrador.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
            });
      });

   }

 }
 
 saveFormDataSendInvitations(idGroup:number){
   //insert invitations
   this.groupsService.insertParticipants(idGroup,this.getArrraySelectedParticipants()).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IResponseId>) => {
     console.log('groupsService.insertParticipants returned ' + JSON.stringify(response));
          
     },
     (error) => {
       // This block will only execute if catchError is used
       console.error('Error handler:', error);
       this.aSnackBar.open('Error durante la creación de invitaciones. Por favor, contacte con el administrador.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error']
        });
     }
   );
}
 

getArrraySelectedParticipants():IParticipantInvitations[]{
   const arrPart:IParticipantInvitations[]=[];
   for (let selPart of this.selectedParticipants) {
     
     let aSelectedKey=selPart.key;
     if (aSelectedKey!=undefined){
       
       if(aSelectedKey.startsWith('NEWINVITATION')){

          const anInvitation={email:selPart.data};
          console.log(' Inviting email: '+anInvitation.email );
          arrPart.push(anInvitation);

       }else {

          let iSeletedKey=Number.parseInt(aSelectedKey);
          console.log(' buildArrayParticipantsFromSelected key:'+iSeletedKey);
          let thePart=this.arrParticipants.find(({id}) => id === iSeletedKey );
          console.log(' Saving as participant: '+thePart?.id +' ' +thePart?.name );
          if(thePart!=undefined)
            arrPart.push(thePart);
        }
     }
  }
   return arrPart;
 }
 
}
