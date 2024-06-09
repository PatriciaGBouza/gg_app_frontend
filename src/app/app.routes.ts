import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GroupsComponent } from './components/groups/groups.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { BalanceComponent } from './components/balance/balance.component';
import { GroupFormComponent } from './components/group-form/group-form.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { authGuard } from './guards/auth.guard';
import { nonAuthGuard } from './guards/non-auth.guard';
import { UserSettingsComponent} from './components/usersettings/usersettings.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';

export const routes: Routes = [
{ path: '', pathMatch: 'full', component: PrincipalComponent },
{ path: 'home', component: HomeComponent, canActivate: [authGuard] },
{ path: 'groups', component: GroupsComponent, canActivate: [authGuard] },
{ path: 'newgroup', component: GroupFormComponent},
{ path: 'editgroup/:id', component: GroupFormComponent},
{ path: 'expenses', component: ExpensesComponent, canActivate: [authGuard] },
{ path: 'newexpense', component: ExpenseFormComponent},
{ path: 'editexpense/:id', component: ExpenseFormComponent},
{ path: 'sign-in', component: SignInComponent, canActivate: [nonAuthGuard] },
{ path: 'sign-up', component: SignUpComponent, canActivate: [nonAuthGuard] },
{ path: 'settings', component: UserSettingsComponent, canActivate: [authGuard] },
{ path: '**', redirectTo: '' }
];
