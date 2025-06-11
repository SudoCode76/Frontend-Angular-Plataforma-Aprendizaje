import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {InicioComponent} from './components/inicio/inicio.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'inicio', component: InicioComponent},

  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', component: InicioComponent }

];
