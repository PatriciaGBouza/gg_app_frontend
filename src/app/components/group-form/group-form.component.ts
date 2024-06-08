import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MatButtonModule} from '@angular/material/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { GroupsService } from '../../services/groups.service';
import { IUser } from '../../interfaces/iuser.interface';
import { switchMap } from 'rxjs';
import { IGroup } from '../../interfaces/igroup.interface';


@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, FileUploadModule, TableModule, MatButtonModule ],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})



export class GroupFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);


  groupsService = inject(GroupsService);


  modelForm: FormGroup|any;
  isEmptyForm: boolean|any;

  user: IUser={ id: 1};

  selectedId: string|any;

  constructor() {
    this.modelForm = new FormGroup(
      {
        name: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required])
        
      },
      []
    );
   
    this.isEmptyForm = true;
  }
  

  ngOnInit(){
    this.activatedRoute.params.subscribe((params: any) => {
      let selectedId = params.id;
      //console.log(" ngOnInit with id "+ selectedId);
      if (selectedId !== undefined) {
        //case: edit group
      if(isNaN(selectedId)){
        alert(
          'Error. Por favor, contacte con el administrador.'
       );
       } else{
        let aGroup =this.groupsService.getById(Number.parseInt(selectedId));
        //console.log(" ngOnInit edit "+ aGroup?.name);
        if (aGroup && aGroup.id){
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
          alert(
            'Error cargando datos del grupo. Por favor, contacte con el administrador.'
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
            alert(
              'Error cargando datos del grupo. Por favor, contacte con el administrador.'
            );
          }
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
      let aGroup = this.groupsService.update(this.modelForm.value, this.user);
     /* this.groupsService
        .update(this.modelForm.value)
        .subscribe((data: IGroup) => {
          console.log('groupsService.update returned ' + JSON.stringify(data));
          let aGroup = data;
          */
          if (aGroup.id) {
            alert(
              'Group ' +
              aGroup.id +  ' ' + aGroup.name +
                ' ' +
                aGroup.description +
                ' actualizado correctamente'
            );
            this.modelForm.reset();
            this.router.navigate(['/groups']);
          } else {
            alert(
              'Error durante la actualización. Por favor, contacte con el administrador.'
            );
          }
        /* });*/
    } else {
      console.log('saveFormData insert');
      //insert
        let aGroup = this.groupsService.insert(this.modelForm.value, this.user);
        /*.subscribe((data: IGroup) => {
          console.log('groupsService.insert returned ' + JSON.stringify(data));
          let aGroup = data;*/

          if (aGroup.id) {
            alert(
              'NUEVO Group ' +
              aGroup.id +  ' ' + aGroup.name +
                ' ' +
                aGroup.description +
                ' creado correctamente'
            );
            this.modelForm.reset();
            this.router.navigate( [ '/editgroup', aGroup.id ] );
          } else {
            alert(
              'Error durante la creación del grupo. Por favor, contacte con el administrador.'
            );
          }
       /* });*/
   /* }*/
  }
  }
}
