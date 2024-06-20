import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalerrorhandlerService implements ErrorHandler {

  handleError(error:any) {
    console.error('Global Error Handler:',error)

   }
}
