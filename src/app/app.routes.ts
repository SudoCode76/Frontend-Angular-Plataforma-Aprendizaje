import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {InicioComponent} from './components/inicio/inicio.component';
import {DashboardEstudianteComponent} from './components/dashboard-estudiante/dashboard-estudiante.component';
import {EncontrarMentorComponent} from './components/encontrar-mentor/encontrar-mentor.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'estudiante',
  children: [
    {path: 'dashboard', component: DashboardEstudianteComponent},
    {path: 'encontrar-mentor', component: EncontrarMentorComponent},
  ]},

  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', component: InicioComponent }

];
