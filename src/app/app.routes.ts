import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {InicioComponent} from './components/inicio/inicio.component';
import {DashboardEstudianteComponent} from './components/dashboard-estudiante/dashboard-estudiante.component';
import {EncontrarMentorComponent} from './components/encontrar-mentor/encontrar-mentor.component';
import {DashboardMentorComponent} from './components/dashboard-mentor/dashboard-mentor.component';
import {ModuloComponent} from './components/modulo/modulo.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'estudiante',
  children: [
    {path: 'dashboard', component: DashboardEstudianteComponent},
    { path: 'modulo/:id', component: ModuloComponent },
    {path: 'encontrar-mentor', component: EncontrarMentorComponent},
  ]},
  {path: 'mentor',
  children: [
    {path:  'dashboard', component: DashboardMentorComponent},
  ]},

  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', component: InicioComponent }

];
