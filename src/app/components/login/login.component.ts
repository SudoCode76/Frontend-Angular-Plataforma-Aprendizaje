import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NgClass, NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  selectedTab: 'student' | 'mentor' = 'student';
  studentForm: FormGroup;
  mentorForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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
    this.errorMessage = null; // Limpiar errores al cambiar de tab
  }

  handleStudentLogin() {
    if (this.studentForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.studentForm.value;

    this.authService.loginStudent(email, password).subscribe(
      (authData) => {
        console.log('Usuario autenticado como estudiante', authData);

        // Usar StorageService en lugar de localStorage
        if (isPlatformBrowser(this.platformId)) {
          this.storageService.setItem('studentId', authData.record.id);
          this.storageService.setItem('token', authData.token);
        }

        this.router.navigate(['/estudiante/dashboard']);
      },
      (error) => {
        console.error('Error de autenticación', error);
        this.errorMessage = 'Las credenciales son incorrectas. Por favor, verifica tu email y contraseña.';
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  handleMentorLogin() {
    if (this.mentorForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.mentorForm.value;

    this.authService.loginMentor(email, password).subscribe(
      (authData) => {
        console.log('Usuario autenticado como mentor', authData);

        // Usar StorageService en lugar de localStorage
        if (isPlatformBrowser(this.platformId)) {
          this.storageService.setItem('mentorId', authData.record.id);
          this.storageService.setItem('token', authData.token);
        }

        this.router.navigate(['/mentor/dashboard']);
      },
      (error) => {
        console.error('Error de autenticación', error);
        this.errorMessage = 'Las credenciales son incorrectas. Por favor, verifica tu email y contraseña.';
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
