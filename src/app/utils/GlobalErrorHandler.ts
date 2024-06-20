import { throwError } from "rxjs";

export default class GlobalErrorHandler {
    static catchErrorFunction= (error: any) => {
    // Handle the error here
    console.error('An error occurred:', error);
    // Optionally, re-throw the error or return a default value
    return throwError(()=>new Error('Something went wrong'));
  }
}