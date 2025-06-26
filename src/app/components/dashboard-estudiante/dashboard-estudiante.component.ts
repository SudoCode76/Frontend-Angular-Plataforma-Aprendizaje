import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {SessionService} from '../../services/session.service';


@Component({
  selector: 'app-dashboard-estudiante',
  imports: [
    RouterLink,
    NgForOf,
    NgClass
  ],
  templateUrl: './dashboard-estudiante.component.html',
  styleUrl: './dashboard-estudiante.component.css'
})
export class DashboardEstudianteComponent implements OnInit{
  studentData: any;  // Almacenaremos los datos del estudiante
  courses: any[] = [];  // Almacenaremos los cursos
  selectedLanguage = 'javascript';  // Idioma seleccionado
  isLoading = true;  // Para mostrar un cargador mientras obtenemos los datos

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudentData();  // Cargar los datos del estudiante
  }

  // Función para cargar los datos del estudiante y los cursos
  loadStudentData() {
    const token = localStorage.getItem('token');  // Recuperar el token de sesión desde el localStorage
    const studentId = localStorage.getItem('studentId');  // Recuperar el ID del estudiante desde el localStorage

    if (!token || !studentId) {
      this.router.navigate(['/login']);  // Si no hay sesión, redirigir a login
      return;
    }

    // Obtener los datos del estudiante
    this.authService.getStudentData(studentId, token).subscribe(
      (data) => {
        this.studentData = data;  // Asignar los datos del estudiante
        this.loadCourses();  // Cargar los cursos del estudiante
      },
      (error) => {
        console.error('Error al obtener los datos del estudiante', error);
        this.router.navigate(['/login']);  // Si hay error, redirigir al login
      }
    );
  }

  // Función para cargar los cursos del estudiante
  loadCourses() {
    const token = localStorage.getItem('token');  // Recuperar el token de sesión

    if (!token) {
      this.router.navigate(['/login']);  // Si no hay sesión, redirigir a login
      return;
    }

    // Obtener los cursos
    this.authService.getCourses(token).subscribe(
      (courses) => {
        this.courses = courses.items;  // Asignar los cursos al array
        this.isLoading = false;  // Detener el cargador
      },
      (error) => {
        console.error('Error al obtener los cursos', error);
        this.isLoading = false;  // Detener el cargador
      }
    );
  }

  // Función para cambiar el idioma seleccionado
  setSelectedLanguage(id: string) {
    this.selectedLanguage = id;
  }

}
