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
import { DropdownModule } from 'primeng/dropdown';

import { IExpense } from '../../interfaces/iexpense.interface';
import { IParticipant } from '../../interfaces/iparticipant.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { UserService } from '../../services/user.service';
import { IApiResponse } from '../../interfaces/iapi-response';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import GlobalErrorHandler from '../../utils/GlobalErrorHandler';
import { catchError } from 'rxjs';
import { IResponseId } from '../../interfaces/iapi-responseId';



@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, CalendarModule, FileUploadModule, TableModule, MatButtonModule,StepperModule,DropdownModule, MatSnackBarModule],
  providers: [],
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
  theGroupIfNoEmptyForm:number;

  /* DATA for the groups dropdown and the paid by dropdown and the uploaded files*/
  arrGroupsCreatedByUser: IGroup[]=[]; 
  arrParticipantsWithinAGroup: IParticipant[]=[];
  uploadedFiles: any[] = [];

  aSnackBar: MatSnackBar;


  constructor( private snackBar: MatSnackBar) {

      /* EMPTY MODEL FORM CREATION*/
      this.modelForm = new FormGroup({
          group: new FormControl(null, [Validators.required]),
          concept: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
          amount: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100000)]),
          paidBy: new FormControl(null, [Validators.required]),
          expenseDate: new FormControl(null, []), 
          maxDate: new FormControl(null, []), 
          expenseStatus: new FormControl(null, []) ,
          image: new FormControl(null, [Validators.maxLength(255)])
          /*participants:  new FormArray([new FormGroup({
            participantName: new FormControl(null, [Validators.required]),
            percentage: new FormControl(null, [Validators.required,  Validators.min(1), Validators.max(100)]),
            amount: new FormControl(null, [Validators.required]),
            expenseStatus: new FormControl(null, []) })
          ]) */
      }
      /*,{
        validators: [Validation.completenessOnPercetages('participants', 'percentage')]
      }*/
        //validators: [Validation.noNaNValidator('amount', 'noNan')]
    );

    this.isEmptyForm = true;
    this.theGroupIfNoEmptyForm=-1;
    this.aSnackBar=snackBar
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
    
    this.groupsService.getAllGroupsByCreatorUser(this.user).subscribe((response: IApiResponse<IGroup[]>) => {
      console.log("groupsService.getAllGroupsByUser returned "+ JSON.stringify(response));
      this.arrGroupsCreatedByUser=  response.data;
    });
      
    
    //LEEMOS DE PARAMS , PARA VER SI ESTAMOS EN MODO EDICION
    this.activatedRoute.params.subscribe((params: any) => {

      const selectedId = params.id;
      console.log("--> ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {

        //case: edit expense
        if(isNaN(selectedId)){
          this.snackBar.open('Error leyendo id de gasto. Por favor, contacte con el administrador', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
        else{

            //GET DATOS DE GASTO
            this.expensesService.getById(Number.parseInt(selectedId)).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IExpense>) => {
              console.log('groupsService.getById returned ' + JSON.stringify(response));
              const aExpense=response.data;
              console.log(" ngOnInit edit "+ JSON.stringify(aExpense));
           
              if (aExpense && aExpense.id && aExpense.group.id){
                  this.isEmptyForm = false;
                  this.theGroupIfNoEmptyForm=aExpense.group.id;
                  //INICIALIZAMOS OPTIONS DE PAID bY DROPDOWN

                  this.groupsService.getById(this.theGroupIfNoEmptyForm).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup>) => {
                    console.log('groupsService.getById returned ' + JSON.stringify(response));
                    const arr=response.data.participants;
                    if (arr!=undefined) this.arrParticipantsWithinAGroup=arr;
                    let aExpDate=aExpense.expenseDate;
                    if(aExpense.expenseDate!=undefined) aExpDate=new Date(aExpense.expenseDate.toString().slice(0,10));
                    let aMaxDate=aExpense.maxDate;
                    if(aExpense.maxDate!=undefined) aMaxDate=new Date(aExpense.maxDate.toString().slice(0,10));
                    this.modelForm = new FormGroup({
                      id: new FormControl(aExpense.id, []),
                      concept: new FormControl(aExpense.concept, [Validators.required,Validators.minLength(3), Validators.maxLength(255)]),
                      amount: new FormControl(aExpense.amount, [Validators.required, Validators.min(1), Validators.max(100000)]),
                      paidBy: new FormControl(arr?.find(({id}) => id === aExpense.paidBy), [Validators.required]),
                      expenseDate: new FormControl(aExpDate, []), 
                      maxDate: new FormControl(aMaxDate, []), 
                      expenseStatus: new FormControl(aExpense.expenseStatus, []) ,
                      image: new FormControl(aExpense.image, [Validators.maxLength(255)]),
                      participants: new FormArray([new FormGroup({
                        participantName: new FormControl(null,[Validators.required]),
                        percentage: new FormControl(null, [Validators.required,  Validators.min(1), Validators.max(100)]),
                        amount: new FormControl(null, [Validators.required]),
                        expenseStatus: new FormControl(null, [])
                      })
                      ]) 
                  }
                  /*,{
                    validators: [Validation.completenessOnPercetages('participants', 'percentage')]}*/
                  );

                    //INICIALIZAMOS DATOS : ARRAY PARTICIPANTES DEL GRUPO DEL GASTO
                    this.updateParticipantsOnForm(aExpense);

                    console.log(" ngOnInit edit expense with num participants" + this.participants.length);
                    console.log(" ngOnInit edit modelForm "+ this.modelForm);
                  },
                   (error) => {
                    console.error('Error handler:', error);
                    this.aSnackBar.open('Error durante la obtención de datos de grupo. Por favor, contacte con el administrador.', 'Cerrar', {
                        duration: 3000,
                        panelClass: ['snackbar-error']
                    });
                  });
                
              }
            },
            (error) => {
              console.error('Error handler:', error);
              this.snackBar.open('Error al cargar gasto. Por favor, contacte con el administrador', 'Cerrar', {
                duration: 3000,
                panelClass: ['snackbar-error']
              });
            });
        } 
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
    const theSelectedGroup=this.modelForm.value?.group?.id;
    if (theSelectedGroup==null) return;
   
    this.groupsService.getById(Number.parseInt(theSelectedGroup)).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IGroup>) => {
      console.log('groupsService.getById returned ' + JSON.stringify(response));
      const arr=response.data.participants;
      if (arr!=undefined) this.arrParticipantsWithinAGroup=arr;

      //update participantsOptions 
      //this.updateParticipantsOnFormForANewExpense( this.modelForm.value.group);
   },
    (error) => {
      console.error('Error handler:', error);
      this.aSnackBar.open('Error durante la obtención de datos de grupo. Por favor, contacte con el administrador.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error']
      });
    });

   


  }


  updateParticipantsOnForm(aExpense: IExpense){
    const arrParticipation =aExpense.participants;
    if(arrParticipation==undefined) return;
    for (let i=0;i<arrParticipation.length;i++){
      console.log(" updateParticipantsOnForm with participant in index "+i +" participant " +arrParticipation[i].participantName);
      let participantItem = new FormGroup({
        participantName: new FormControl({value: arrParticipation[i].participantName, disabled:true}, [Validators.required]),
        percentage: new FormControl({value:arrParticipation[i].percentage, disabled:true}, [Validators.required]),
        amount: new FormControl({value:arrParticipation[i].amount, disabled:true}, [Validators.required,  Validators.max(100)]),
        expenseStatus: new FormControl({value:arrParticipation[i].expenseStatus, disabled:true}, []),
      });

      if(this.participants.at(i)!=undefined)
        this.participants.setControl(i,participantItem);
      else          
      // Add the new form group to the FormArray
      this.participants.insert(i,participantItem);
    }
  }

  
/*
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

*/


  saveFormData(): void {
   
   if (this.modelForm.value.id) {
      console.log('--> saveFormData update '+ JSON.stringify(this.modelForm.value));
      console.log('--> saveFormData update '+this.modelForm.value?.paidBy?.id);
      //update
      this.expensesService.update(this.modelForm.value,this.theGroupIfNoEmptyForm, this.modelForm.value?.paidBy?.id).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<null>) => {
          console.log('expensesService.update returned ' + JSON.stringify(response));
                          
          this.modelForm.reset();

          this.snackBar.open('Gasto actualizado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success']
           });

          if(this.parent ==='list')
             this.router.navigate(['/expenses']);
          else 
             this.router.navigate(['/home']);

        },
        (error) => {
            console.error('Error handler:', error);
            this.aSnackBar.open('Error durante la actualización de gasto. Por favor, contacte con el administrador.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
        });
             
            });
    } else {
      console.log('--> saveFormData insert '+ JSON.stringify(this.modelForm.value));

        //insert expense
        this.expensesService.insert(this.modelForm.value, this.modelForm.value?.group?.id, this.modelForm.value?.paidBy?.id).pipe(catchError(GlobalErrorHandler.catchErrorFunction)).subscribe((response: IApiResponse<IResponseId>) => {
          console.log('expensesService.insert returned ' + JSON.stringify(response));
        
          this.snackBar.open('Nuevo gasto creado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
            
          this.modelForm.reset();
          this.router.navigate(['/expenses']);
           
        },
        (error) => {
            console.error('Error handler:', error);
            this.aSnackBar.open('Error durante la creación de nuevo gasto. Por favor, contacte con el administrador.', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error']
              });
        });
  }
  }

 


 onUpload(event:FileUploadEvent) {
  for(let file of event.files) {
      this.uploadedFiles.push(file);
  }

  this.snackBar.open('Fichero añadido correctamente', 'Cerrar', {
    duration: 3000,
    panelClass: ['snackbar-success']
  });
}


}
