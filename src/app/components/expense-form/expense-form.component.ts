import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Validation from '../../utils/Validation';

import { ExpensesService } from '../../services/expenses.service';
import { GroupsService } from '../../services/groups.service';

import { MatButtonModule } from '@angular/material/button';

import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { Message, MessageService } from 'primeng/api';

import { IUser } from '../../interfaces/iuser.interface';
import { IExpense } from '../../interfaces/iexpense.interface';
import { IParticipant } from '../../interfaces/iparticipant.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, CalendarModule, FileUploadModule, TableModule, MatButtonModule,StepperModule,ToastModule,DropdownModule],
  providers: [MessageService],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})



export class ExpenseFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  parent: string|any = ''; 

  user:any;

  /* SERVICES */
  expensesService = inject(ExpensesService);
  groupsService=inject (GroupsService);
  userService=inject(UserService);
 
  /* REACTIVE FORM */ 
  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;

  /* DATA for the groups dropdown and the paid by dropdown and the uploaded files*/
  arrGroupsCreatedByUser: IGroup[]=[]; 
  arrParticipantsWithinAGroup: IParticipant[]=[];
  uploadedFiles: any[] = [];


  messages: Message[] = [];
  

  constructor(private messageService: MessageService) {

      /* EMPTY MODEL FORM CREATION*/
      this.modelForm = new FormGroup({
          group: new FormControl(null, [Validators.required]),
          concept: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
          amount: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100000)]),
          paidBy: new FormControl(null, []),
          expenseDate: new FormControl(null, []), 
          maxDate: new FormControl(null, []), 
          expenseStatus: new FormControl(null, []) ,
          participants:  new FormArray([new FormGroup({
            participantName: new FormControl(null, [Validators.required]),
            percentage: new FormControl(null, [Validators.required,  Validators.min(1), Validators.max(100)]),
            amount: new FormControl(null, [Validators.required]),
            expenseStatus: new FormControl(null, []) })
          ]) 
      },
      {
        validators: [Validation.completenessOnPercetages('participants', 'percentage')]
      }
        //validators: [Validation.noNaNValidator('amount', 'noNan')]
    );

    this.isEmptyForm = true;
    this.messageService=messageService;
  }

 

  ngOnInit(){

      
    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      // read param from paramMap
      // TO-DO: TRY TO CHANGE THIS AND REPLACE WITH STATES, also in group form
      this.parent = paramMap.get('parent');
      this.parent ??='home';

    });

    //INICIALIZAMOS DATOS
    this.user = this.userService.getUserFromLocalStorage();
    this.groupsService.getAllGroupsByUser(this.user).subscribe((data: IGroup[]) => {
      console.log("groupsService.getAllGroups returned "+ JSON.stringify(data));
      this.arrGroupsCreatedByUser=  data;
    });
  
      
    
    //LEEMOS DE PARAMS , PARA VER SI ESTAMOS EN MODO EDICION
    this.activatedRoute.params.subscribe((params: any) => {

      const selectedId = params.id;
      console.log(" ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {

        //case: edit expense
        if(isNaN(selectedId)){
          this.messages.push(
            { severity: 'error', summary: 'Error', detail: 'Por favor, contacte con el administrador' }
          );
        } 
        else{

          //GET DATOS DE GASTO
          const aExpense =this.expensesService.getById(Number.parseInt(selectedId));
          console.log(" ngOnInit edit "+ JSON.stringify(aExpense));

          if (aExpense && aExpense.id){
            this.isEmptyForm = false;
            this.modelForm = new FormGroup({
                id: new FormControl(aExpense.id, []),
                group: new FormControl(aExpense.group,[]),
                concept: new FormControl(aExpense.concept, [Validators.required,Validators.minLength(3), Validators.maxLength(255)]),
                amount: new FormControl(aExpense.amount, [Validators.required, Validators.min(1), Validators.max(100000)]),
                paidBy: new FormControl(aExpense.paidBy, []),
                expenseDate: new FormControl(aExpense.expenseDate, []), 
                maxDate: new FormControl(aExpense.maxDate, []), 
                expenseStatus: new FormControl(aExpense.expenseStatus, []) ,
                participants: new FormArray([new FormGroup({
                  participantName: new FormControl(null, [Validators.required]),
                  percentage: new FormControl(null, [Validators.required,  Validators.min(1), Validators.max(100)]),
                  amount: new FormControl(null, [Validators.required]),
                  expenseStatus: new FormControl(null, [])
                })
                ]) 
            },{
              validators: [Validation.completenessOnPercetages('participants', 'percentage')]
            });

            //INICIALIZAMOS OPTIONS DE PAID bY DROPDOWN
            const arr= this.groupsService.getAllParticipantsWithinAGroup(this.user, aExpense.group);
            if (arr!=undefined) this.arrParticipantsWithinAGroup=arr;


            //INICIALIZAMOS DATOS : ARRAY PARTICIPANTES DEL GRUPO DEL GASTO
            this.updateParticipantsOnForm(aExpense);

            console.log(" ngOnInit edit expense with num participants" + this.participants.length);
            console.log(" ngOnInit edit modelForm "+ this.modelForm);
          
          }else{
            this.messages.push(
              { severity: 'error', summary: 'Error cargando datos de gasto', detail: 'Por favor, contacte con el administrador' }
            );
          }

            /* 
              /* cuando API ready
            TODO
              });*/
       }
      }else{

        /* EN EL CASO DE NUEVO GASTO, EL FORM YA ESTÁ CREADO EN EL CONSTRUCTOR */
        console.log(" ngOnInit add new ");
        console.log(" ngOnInit init modelForm "+ this.modelForm);

      }

    });
  }
 
     
 get participants() {
    return this.modelForm.get('participants') as FormArray;
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


  validateForm(
    validator: string
  ): boolean | undefined {

    return (
      this.modelForm.hasError(validator) &&
      this.modelForm?.touched
    );
  }


  onChangeGroup(){
    console.log('onChangeGroup selected '+ this.modelForm.value?.group?.id);
    //update paidByOptions 
    const theSelectedGroup=this.modelForm.value?.group;
    const arr=this.groupsService.getAllParticipantsWithinAGroup(this.user, theSelectedGroup);
    if (arr!=undefined) this.arrParticipantsWithinAGroup=arr;

    //update participantsOptions 
    this.updateParticipantsOnFormForANewExpense( this.modelForm.value.group);
  }


  updateParticipantsOnForm(aExpense: IExpense){
    const arrParticipation =aExpense.participants;
 
    for (let i=0;i<arrParticipation.length;i++){
      console.log(" updateParticipantsOnForm with participant in index "+i +" participant " +arrParticipation[i].participantName);
      let participantItem = new FormGroup({
        participantName: new FormControl(arrParticipation[i].participantName, [Validators.required]),
        percentage: new FormControl(arrParticipation[i].percentage, [Validators.required]),
        amount: new FormControl(arrParticipation[i].amount, [Validators.required,  Validators.max(100)]),
        expenseStatus: new FormControl(arrParticipation[i].expenseStatus, []),
      });

      if(this.participants.at(i)!=undefined)
        this.participants.setControl(i,participantItem);
      else          
      // Add the new form group to the FormArray
      this.participants.insert(i,participantItem);
    }
  }


  updateParticipantsOnFormForANewExpense(aGroup:IGroup){
    const arrParticipationOnANewExpense =this.groupsService.getAllParticipantsWithinAGroup(this.user,aGroup);
    if(arrParticipationOnANewExpense=== undefined) {
        this.participants.clear();
        console.log("  participants form cleared");
    }else{
      this.participants.clear();
      for (let i=0;i<arrParticipationOnANewExpense.length;i++){
        console.log(" updateParticipantsOnFormForANewExpense with participant in index "+i +" participant " +arrParticipationOnANewExpense[i].name);
        let participantItem = new FormGroup({
          participantName: new FormControl(arrParticipationOnANewExpense[i].name, [Validators.required]),
          percentage: new FormControl(0, [Validators.required]),
          amount: new FormControl(0, [Validators.required,  Validators.max(100)]),
          expenseStatus: new FormControl('Reported', []),
        });

        if(this.participants.at(i)!=undefined)
          this.participants.setControl(i,participantItem);
        else          
        // Add the new form group to the FormArray
        this.participants.insert(i,participantItem);
      }
    }
  }




  saveFormData(): void {
   
   if (this.modelForm.value.id) {
      console.log(' saveFormData update '+JSON.stringify(this.modelForm.value));
      //update
      let aExpense = this.expensesService.update(this.modelForm.value, this.user);
     /* this.expensesService
        .update(this.modelForm.value)
        .subscribe((data: IExpense) => {
          console.log('expenseService.update returned ' + JSON.stringify(data));
          let aExpense = data;
          */
          if (aExpense.id) {
            this.messageService.add(
              { severity: 'success', summary: 'Gasto actualizado correctamente', detail: 'Gasto ' +  aExpense.id +  ' ' + aExpense.concept +  ' ' +  aExpense.amount + ' actualizado correctamente' , key: 'br', life: 3000  }
            );
          
            this.modelForm.reset();
            if(this.parent ==='list')
              this.router.navigate(['/expenses']);
            else 
              this.router.navigate(['/home']);

            
          } else {
            this.messages.push(
              { severity: 'error', summary: 'Error durante la actualización', detail: 'Por favor, contacte con el administrador' }
            )
          }
        /* });*/
    } else {
      console.log('saveFormData insert ' +this.modelForm.value);
      //insert
        let aExpense = this.expensesService.insert(this.modelForm.value, this.user);
        /*.subscribe((data: IExpense) => {
          console.log('expensesService.insert returned ' + JSON.stringify(data));
          let aExpense = data;*/

          if (aExpense.id) {
            this.messageService.add(
              { severity: 'success', summary: 'Gasto creado correctamente', detail: 'Nuevo gasto ' +   aExpense.id +  ' ' + aExpense.concept +  ' ' +  aExpense.amount + ' creado correctamente' , key: 'br', life: 3000 }
            );
            
            this.modelForm.reset();
            this.router.navigate(['/expenses']);
          } else {
            this.messages.push(
              { severity: 'error', summary: 'Error durante la creación', detail: 'Por favor, contacte con el administrador' }
            )
          }
       /* });*/
   /* }*/
  }
  }

 


 onUpload(event:FileUploadEvent) {
  for(let file of event.files) {
      this.uploadedFiles.push(file);
  }

  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}

 showBottomRight() {
  this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', key: 'br', life: 3000 });
}
}
