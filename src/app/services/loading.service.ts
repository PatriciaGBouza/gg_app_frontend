import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = false;

  showLoadingSpinner(){
    this.loading = true;
    //code to show loading spinner
  }

  hideLoadingSpinner(){
    this.loading = false;
    // code to hide loading spinner
  }

  isLoading():boolean{
    return this.loading;
  }



  constructor() { }
}
