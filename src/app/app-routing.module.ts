import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AddComponent } from './components/add/add/add.component';
import { Add1Component } from './components/add1/add1/add1.component';
import { Add2Component } from './components/add2/add2/add2.component';
import { LoginComponent } from './components/auth/login/login/login.component';
import { SignUpComponent } from './components/auth/sign_up/sign-up/sign-up.component';
import { DetailsComponent } from './components/details/details/details.component';
import { FiltredHousesComponent } from './components/FiltredHouses/filtred-houses/filtred-houses.component';
import { UserAccountComponent } from './components/UserAccount/user-account/user-account.component';
import { FavorisComponent } from './components/UserAccount/Favoris/favoris/favoris.component';
import { NotificationsComponent } from './components/UserAccount/Notifications/notifications/notifications.component';
import { ParametresComponent } from './components/UserAccount/Parametres/parametres/parametres.component';
import { CompteComponent } from './components/UserAccount/Compte/compte/compte.component';
import { UsersComponent } from './components/Admin/users/users/users.component';
import { LogementsComponent } from './components/Admin/logements/logements/logements.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'Add',
    children: [
      { path: 'Ajouter_annonce', component: Add1Component },
      { path: 'Ajouter_annonce2', component: Add2Component },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'details_annonce/:id', component: DetailsComponent },
  { path: 'filtered_houses', component: FiltredHousesComponent },
  {
    path: 'compte', children: [

      { path: 'logements', component: CompteComponent },
      { path: 'Notifications', component: NotificationsComponent },
      { path: 'Messages', component: FavorisComponent },
      { path: 'Parametres', component: ParametresComponent }
    ]
  },
  {
    path: 'Admin', children: [

      { path: 'Logements', component: LogementsComponent },
      { path: 'Users', component: UsersComponent },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
