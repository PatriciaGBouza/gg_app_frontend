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
      
     if (percentagesSum != 100) {
        
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

  static noNaNValidator: ValidatorFn = (
    control: AbstractControl<number | null>,
  ) => {
    const value = control.value
  
    if (Number.isNaN(value)) {
      // Value is null and not NaN, so this is never reached because Number.isNaN(null) is false,
      // the control (and group) is marked valid and the submit button is not disabled
      return {
        invalidValue: {
          value: value
        },
      }
    }
    return null
  }
  
}


