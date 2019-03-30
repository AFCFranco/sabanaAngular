import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ScrollingModule} from '@angular/cdk/scrolling';
// Services
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { JwtInterceptor } from './services/jwt-interceptor';

// Material modules
import { MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatButtonToggleModule,
  MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
  MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule, MatGridListModule,
  MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DATE_LOCALE_PROVIDER
 } from '@angular/material';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SabanasComponent } from './components/sabanas/sabanas.component';
import { StartContentComponent } from './components/start-content/start-content.component';
import { SabanasDetailsComponent } from './components/sabanas-details/sabanas-details.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { MonitoringCardComponent } from './components/monitoring-card/monitoring-card.component';
import { PressureMapComponent } from './components/pressure-map/pressure-map.component';
import { BedOrientationComponent } from './components/bed-orientation/bed-orientation.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertDivComponent } from './components/alert-div/alert-div.component';
import { RepositioningComponent } from './components/repositioning/repositioning.component';
import { RegionAlertsComponent } from './components/region-alerts/region-alerts.component';
import { RegionAlertsTableComponent } from './components/region-alerts-table/region-alerts-table.component';
import { DialogRepositioningComponent } from './dialog-repositioning/dialog-repositioning.component';
import { RepositioningSilhouetteComponent } from './repositioning-silhouette/repositioning-silhouette.component';
import { CronometerComponent } from './components/cronometer/cronometer.component';
import { PressureMapIconComponent } from './components/pressure-map-icon/pressure-map-icon.component';
import { SilhouetteComponent } from './components/silhouette/silhouette.component';
import { UserConfigComponent } from './components/user-config/user-config.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavComponent,
    SidenavComponent,
    SabanasComponent,
    StartContentComponent,
    SabanasDetailsComponent,
    MonitoringComponent,
    MonitoringCardComponent,
    PressureMapComponent,
    BedOrientationComponent,
    FooterComponent,
    AlertDivComponent,
    RepositioningComponent,
    RegionAlertsComponent,
    RegionAlertsTableComponent,
    DialogRepositioningComponent,
    RepositioningSilhouetteComponent,
    CronometerComponent,
    PressureMapIconComponent,
    SilhouetteComponent,
    UserConfigComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    /** Material Modules */
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule, // Para indicar que se están cargando los datos desde el backend
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgbModule,
    ScrollingModule,
    MatDialogModule,
    MatRadioModule,
    MatSlideToggleModule
  ],
  entryComponents: [
    SabanasDetailsComponent,
    DialogRepositioningComponent
  ],
  providers: [
    AuthGuardService,
    AuthService,
    { // Se incluye el interceptor de mensajes para  que cada solicitud enviada al servidor haga el envío del token
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
