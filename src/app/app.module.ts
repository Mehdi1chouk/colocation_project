import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { AddComponent } from './components/add/add/add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { Add1Component } from './components/add1/add1/add1.component';
import { Add2Component } from './components/add2/add2/add2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './components/auth/login/login/login.component';
import { SignUpComponent } from './components/auth/sign_up/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './components/details/details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { DataFormService } from './services/data-form.service';
import * as mapboxgl from 'mapbox-gl';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AgmCoreModule } from '@agm/core';
import { FiltreComponent } from './components/filtre/filtre/filtre.component';
import { DatePipe } from '@angular/common';
import { FiltredHousesComponent } from './components/FiltredHouses/filtred-houses/filtred-houses.component';
import { UserAccountComponent } from './components/UserAccount/user-account/user-account.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NotificationsComponent } from './components/UserAccount/Notifications/notifications/notifications.component';
import { ParametresComponent } from './components/UserAccount/Parametres/parametres/parametres.component';
import { FavorisComponent } from './components/UserAccount/Favoris/favoris/favoris.component';
import { CompteComponent } from './components/UserAccount/Compte/compte/compte.component';
import { SocketioService } from './services/socketio/socketio.service';
import { UsersComponent } from './components/Admin/users/users/users.component';
import { LogementsComponent } from './components/Admin/logements/logements/logements.component';
import { DeleteNotifComponent } from './components/UserAccount/DeleteNotif/delete-notif/delete-notif.component';
import { NonAuthentifieComponent } from './components/pop-up_Modals/NonAuth/non-authentifie/non-authentifie.component';
import { MsgReservationComponent } from './components/pop-up_Modals/reservation/msg-reservation/msg-reservation.component';
import { CoverComponent } from './components/cover/cover/cover.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    AddComponent,
    Add1Component,
    Add2Component,
    LoginComponent,
    SignUpComponent,
    DetailsComponent,
    FiltreComponent,
    FiltredHousesComponent,
    UserAccountComponent,
    NotificationsComponent,
    ParametresComponent,
    FavorisComponent,
    CompteComponent,
    UsersComponent,
    LogementsComponent,
    DeleteNotifComponent,
    NonAuthentifieComponent,
    MsgReservationComponent,
    CoverComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    LeafletModule,
    CarouselModule.forRoot(),
  ],
  providers: [DataFormService, DatePipe, SocketioService],
  bootstrap: [AppComponent],
})
export class AppModule { }
