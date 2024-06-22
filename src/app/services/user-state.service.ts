import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoadedUserData } from '../interfaces/user/iloaded-user-data';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userSubject: BehaviorSubject<ILoadedUserData | null>;
  public user$: Observable<ILoadedUserData | null>;

  constructor() {
    const userFromLocalStorage = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.userSubject = new BehaviorSubject<ILoadedUserData | null>(userFromLocalStorage);
    this.user$ = this.userSubject.asObservable();
  }

  setUser(user: ILoadedUserData): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): ILoadedUserData | null {
    return this.userSubject.value;
  }

  getUserObservable(): Observable<ILoadedUserData | null> {
    return this.user$;
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }
}
