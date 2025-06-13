import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;
  selectedTab: 'student' | 'mentor' = 'student';
  studentForm: FormGroup;
  mentorForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
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

  handleStudentLogin() {
    if (this.studentForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/student/dashboard']);
    }, 1500);
  }

  handleMentorLogin() {
    if (this.mentorForm.invalid) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/mentor/dashboard']);
    }, 1500);
  }

}
