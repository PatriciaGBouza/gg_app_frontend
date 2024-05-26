import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GroupsComponent } from './components/groups/groups.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { BalanceComponent } from './components/balance/balance.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
{ path: '', pathMatch:'full', redirectTo:'home' },
{ path: 'home', component: HomeComponent},
{ path: 'groups', component: GroupsComponent},
{ path: 'expenses', component: ExpensesComponent},
{ path: 'balance', component: BalanceComponent},
{ path: 'sign-in', component: SignInComponent },
{ path: 'sign-up', component: SignUpComponent },
{ path: '**', redirectTo:'home'}

];
