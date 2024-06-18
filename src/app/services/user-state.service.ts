import { Injectable, signal } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userSignal = signal<IUser | null>(null);

  setUser(user: IUser) {
    this.userSignal.set(user);
  }

  getUser() {
    return this.userSignal();
  }

  clearUser() {
    this.userSignal.set(null);
  }
}
