import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = false;

  showLoadingSpinner(){
    this.loading = true;
    console.log('loading here');
    //code to show loading spinner
  }

  hideLoadingSpinner(){
    this.loading = false;
    console.log('hidden loading spinner');
    // code to hide loading spinner
  }

  isLoading():boolean{
    return this.loading;
  }



  constructor() { }
}
