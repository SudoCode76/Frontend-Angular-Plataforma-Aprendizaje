import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false; // Estado para mostrar el cargador mientras se procesa el inicio de sesión
  selectedTab: 'student' | 'mentor' = 'student'; // Para alternar entre los formularios de estudiante y mentor
  studentForm: FormGroup; // Formulario para estudiante
  mentorForm: FormGroup; // Formulario para mentor

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    // Inicializamos los formularios con validaciones
    this.studentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validación para el email
      password: ['', Validators.required]  // Validación para la contraseña
    });

    this.mentorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validación para el email
      password: ['', Validators.required]  // Validación para la contraseña
    });
  }

  // Cambiar entre el formulario de estudiante y mentor
  switchTab(tab: 'student' | 'mentor') {
    this.selectedTab = tab;
  }

  // Manejo del inicio de sesión del estudiante
  handleStudentLogin() {
    if (this.studentForm.invalid) return;  // Si el formulario es inválido, no hacer nada
    this.isLoading = true;  // Activamos el cargador

    const { email, password } = this.studentForm.value;  // Obtenemos los valores del formulario

    this.authService.loginStudent(email, password).subscribe(
      (authData) => {
        console.log('Usuario autenticado como estudiante', authData);
        // Guardamos el ID del estudiante y el token en el localStorage
        localStorage.setItem('studentId', authData.record.id);
        localStorage.setItem('token', authData.token);
        this.router.navigate(['/estudiante/dashboard']);  // Redirigimos al dashboard
      },
      (error) => {
        console.error('Error de autenticación', error);
        // Aquí podrías agregar un mensaje para mostrar al usuario si hay un error
      },
      () => {
        this.isLoading = false;  // Desactivamos el cargador
      }
    );
  }

  // Manejo del inicio de sesión del mentor
  handleMentorLogin() {
    if (this.mentorForm.invalid) return;  // Si el formulario es inválido, no hacer nada
    this.isLoading = true;  // Activamos el cargador

    const { email, password } = this.mentorForm.value;  // Obtenemos los valores del formulario

    this.authService.loginMentor(email, password).subscribe(
      (authData) => {
        console.log('Usuario autenticado como mentor', authData);
        // Guardamos el ID del mentor y el token en el localStorage
        localStorage.setItem('mentorId', authData.record.id);
        localStorage.setItem('token', authData.token);
        this.router.navigate(['/mentor/dashboard']);  // Redirigimos al dashboard del mentor
      },
      (error) => {
        console.error('Error de autenticación', error);
        // Aquí podrías agregar un mensaje para mostrar al usuario si hay un error
      },
      () => {
        this.isLoading = false;  // Desactivamos el cargador
      }
    );
  }
}
