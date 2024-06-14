import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ExpensesService } from '../../services/expenses.service';
import { Message, MessageService } from 'primeng/api';
import { IUser } from '../../interfaces/iuser.interface';
import { IExpense, IExpenseParticipant } from '../../interfaces/iexpense.interface';
import { GroupParticipantsService } from '../../services/group-participants.service';
import { IGroup } from '../../interfaces/igroup.interface';
import Validation from '../../utils/Validation';


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
  groupParticipantsService=inject(GroupParticipantsService);

  arrParticipants:IExpenseParticipant[]=[];
  arrParticipantsExpenses:IExpense[]=[];


  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;


  messages: Message[] = [];

  user: IUser={ id: 1};
  

  selectedId: string|any;

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService,private fb: FormBuilder) {
    this.modelForm = new FormGroup({
        concept: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [Validators.required]),
        paidBy: new FormControl(null, []),
        expenseDate: new FormControl(null, []), 
        maxDate: new FormControl(null, []), 
        expenseStatus: new FormControl(null, []) ,
        participants:  new FormArray([new FormGroup({
          participantName: new FormControl(null, [Validators.required]),
          percentage: new FormControl(null, [Validators.required,  Validators.max(1)]),
          amount: new FormControl(null, [Validators.required]),
          expenseStatus: new FormControl(null, [])

        })
        ]) 
      

    },
    {
      validators: [Validation.completenessOnPercetages('participants', 'percentage')]
    }
  );
    this.isEmptyForm = true;
    this.messageService=messageService;
  
      
  }

  get participants() {
    return this.modelForm.get('participants') as FormArray;
  }

 

  ngOnInit(){

    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      // read param from paramMap
      // TO-DO: TRY TO CHANGE THIS AND REPLACE WITH STATES, also in expense form
      const paramValue = paramMap.get('parent');
      console.log('parent '+ paramValue);
      // use parameter...
    

    });

    

    
    

    this.activatedRoute.params.subscribe((params: any) => {
      let selectedId = params.id;
      console.log(" ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {
        //case: edit expense
      if(isNaN(selectedId)){
          this.messages.push(
            { severity: 'error', summary: 'Error', detail: 'Por favor, contacte con el administrador' }
          );
       } else{
        let aExpense =this.expensesService.getById(Number.parseInt(selectedId));

        console.log(" ngOnInit edit "+ aExpense?.concept);
        if (aExpense && aExpense.id){
          this.isEmptyForm = false;
          this.modelForm = new FormGroup({
              id: new FormControl(aExpense.id, []),
              concept: new FormControl(aExpense.concept, [Validators.required]),
              amount: new FormControl(aExpense.amount, [Validators.required]),
              paidBy: new FormControl(aExpense.paidBy, []),
              expenseDate: new FormControl(aExpense.expenseDate, []), 
              maxDate: new FormControl(aExpense.maxDate, []), 
              expenseStatus: new FormControl(aExpense.expenseStatus, []) ,
              participants: new FormArray([new FormGroup({
                participantName: new FormControl(null, [Validators.required]),
                percentage: new FormControl(null, [Validators.required,  Validators.max(1)]),
                amount: new FormControl(null, [Validators.required]),
                expenseStatus: new FormControl(null, [])
              })
              ]) 
          },{
            validators: [Validation.completenessOnPercetages('participants', 'percentage')]
          });
          
          
          for (let i=0;i<aExpense.participants.length;i++){
            console.log(" ngOnInit edit expense with participant in index "+i +" participant " +aExpense.participants[i].participantName);
            let participantItem = new FormGroup({
              participantName: new FormControl(aExpense.participants[i].participantName, [Validators.required]),
              percentage: new FormControl(aExpense.participants[i].percentage, [Validators.required,  Validators.max(100)]),
              amount: new FormControl(aExpense.participants[i].amount, [Validators.required]),
              expenseStatus: new FormControl(aExpense.participants[i].expenseStatus, []),
            });

            if(this.participants.at(i)!=undefined)
              this.participants.setControl(i,participantItem);
            else          
            // Add the new form group to the FormArray
            this.participants.insert(i,participantItem);
          }
          
          console.log(" ngOnInit edit expense with num participants" + this.participants.length);
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
        console.log(" ngOnInit add new ");
        /* TO_DO: falta manejar grupo*/
        this.arrParticipants =this.groupParticipantsService.getAllParticipantsWithinAGroup(this.user);
        for (let i=0;i<this.arrParticipants.length;i++){
          console.log(" ngOnInit edit expense with participant in index "+i +" participant " +this.arrParticipants[i].participantName);
          let participantItem = new FormGroup({
            participantName: new FormControl(this.arrParticipants[i].participantName, [Validators.required]),
            percentage: new FormControl(this.arrParticipants[i].percentage, [Validators.required]),
            amount: new FormControl(this.arrParticipants[i].amount, [Validators.required,  Validators.max(100)]),
            expenseStatus: new FormControl(this.arrParticipants[i].expenseStatus, []),
          });

          if(this.participants.at(i)!=undefined)
            this.participants.setControl(i,participantItem);
          else          
          // Add the new form group to the FormArray
          this.participants.insert(i,participantItem);
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


  validateForm(
    validator: string
  ): boolean | undefined {

    return (
      this.modelForm.hasError(validator) &&
      this.modelForm?.touched
    );
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
            this.router.navigate(['/expenses']);
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
