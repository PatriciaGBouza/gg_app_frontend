import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { ExpensesService } from '../../services/expenses.service';
import { Message, MessageService } from 'primeng/api';
import { IUser } from '../../interfaces/iuser.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, CalendarModule, FileUploadModule, TableModule, MatButtonModule,StepperModule,ToastModule],
  providers: [MessageService],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  parent: string = '';

  expensesService = inject(ExpensesService);
  groupParticipantsService=inject(GroupsService);

  arrGroups:IGroup[]=[];


  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;

  messages: Message[] = [];

  user: IUser={ id: 1};

  selectedId: string|any;

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {
    this.modelForm = new FormGroup(
      {
        concept: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [Validators.required]),
        paidBy: new FormControl(null, []),
        expenseDate: new FormControl(null, []), 
        maxDate: new FormControl(null, []), 
        expenseStatus: new FormControl(null, []) 
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



      this.arrGroups = this.groupParticipantsService.getAllGroupsByUser(this.user);

    });

    

    this.activatedRoute.params.subscribe((params: any) => {
      let selectedId = params.id;
      //console.log(" ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {
        //case: edit expense
      if(isNaN(selectedId)){
          this.messages.push(
            { severity: 'error', summary: 'Error', detail: 'Por favor, contacte con el administrador' }
          );
       } else{
        let aExpense =this.expensesService.getById(Number.parseInt(selectedId));
        //console.log(" ngOnInit edit "+ aGroup?.name);
        if (aExpense && aExpense.id){
          this.isEmptyForm = false;
          this.modelForm = new FormGroup(
            {
              id: new FormControl(aExpense.id, []),
              concept: new FormControl(aExpense.concept, [Validators.required]),
              amount: new FormControl(aExpense.amount, [Validators.required]),
              paidBy: new FormControl(aExpense.paidBy, []),
              expenseDate: new FormControl(aExpense.expenseDate, []), 
              maxDate: new FormControl(aExpense.maxDate, []), 
              expenseStatus: new FormControl(aExpense.expenseStatus, []) 
            },
            []
          );



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
      }
    });
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

  

  saveFormData(): void {
   
   if (this.modelForm.value.id) {
      console.log(' saveFormData update');
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
            this.router.navigate(['/expenses']);
          } else {
            this.messages.push(
              { severity: 'error', summary: 'Error durante la actualización', detail: 'Por favor, contacte con el administrador' }
            )
          }
        /* });*/
    } else {
      console.log('saveFormData insert');
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
