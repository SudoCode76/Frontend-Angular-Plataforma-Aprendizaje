import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgClass, NgIf} from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  selectedTab: 'student' | 'mentor' = 'student';
  studentForm: FormGroup;
  mentorForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.studentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.mentorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  switchTab(tab: 'student' | 'mentor') {
    this.selectedTab = tab;
  }

  // Manejo del login de estudiante
  async handleStudentLogin() {
    if (this.studentForm.invalid) return;
    this.isLoading = true;
    const { email, password } = this.studentForm.value;

    try {
      const user = await this.authService.loginStudent(email, password);
      console.log('Usuario autenticado como estudiante', user);
      this.router.navigate(['/estudiante/dashboard']);
    } catch (error) {
      console.error('Error de autenticación', error);
      // Aquí podrías agregar un mensaje para mostrar al usuario
    } finally {
      this.isLoading = false;
    }
  }

  // Manejo del login de mentor
  async handleMentorLogin() {
    if (this.mentorForm.invalid) return;
    this.isLoading = true;
    const { email, password } = this.mentorForm.value;

    try {
      const user = await this.authService.loginMentor(email, password);
      console.log('Usuario autenticado como mentor', user);
      this.router.navigate(['/mentor/dashboard']);
    } catch (error) {
      console.error('Error de autenticación', error);
      // Aquí podrías agregar un mensaje para mostrar al usuario
    } finally {
      this.isLoading = false;
    }
  }
}
