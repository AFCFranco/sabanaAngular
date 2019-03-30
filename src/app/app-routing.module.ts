import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { HomeComponent } from './components/home/home.component';
import { StartContentComponent } from './components/start-content/start-content.component';
import { SabanasComponent } from './components/sabanas/sabanas.component';
import { MonitoringComponent } from './components/monitoring/monitoring.component';
import { LoginComponent } from './components/login/login.component';
import { UserConfigComponent } from './components/user-config/user-config.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: StartContentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sabanas',
        component: SabanasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'monitoring',
        component: MonitoringComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userconfig',
        component: UserConfigComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  { path: 'login',
    component: LoginComponent,
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
