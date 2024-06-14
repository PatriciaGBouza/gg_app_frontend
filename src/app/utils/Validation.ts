import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export default class Validation {
  static completenessOnPercetages(formArrayControlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
       
      const formArray =controls.get('participants') as FormArray;
      let percentagesSum:number=0;
      let percentage:string;
      for (let i=0;i<formArray.length;i++){
        ({percentage}=formArray.value[i]);
        console.log('completenessOnPercetages validation suming: '+percentage);
        percentagesSum+=Number.parseFloat(percentage);
      }
      let t= Math.round(percentagesSum * 100) / 100;
      console.log('ERROR ON completenessOnPercetages validation for total value: '+t)
      if (t != 1) {
        
        console.log('before: ' +formArray.parent);
        

        for (let i=0;i<formArray.controls.length;i++){
          formArray.controls[i].get(checkControlName)?.setErrors({ totalIncomplete: true });
          console.log('after: ' +formArray.controls[i].get(checkControlName));
        }
          return { totalIncomplete: true };
      } else {
        return null;
      }
    }
  }

  
}


