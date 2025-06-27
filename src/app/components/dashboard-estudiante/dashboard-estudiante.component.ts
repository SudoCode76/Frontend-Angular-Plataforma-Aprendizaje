import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { isPlatformBrowser } from '@angular/common';

interface Course {
  id: string;
  titulo: string;
  descripcion: string;
  portada: string;
  lenguaje?: string;
  color?: string;
  portadaUrl?: string;
}

@Component({
  selector: 'app-dashboard-estudiante',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,

  ],
  templateUrl: './dashboard-estudiante.component.html',
  styleUrl: './dashboard-estudiante.component.css'
})
export class DashboardEstudianteComponent implements OnInit {
  studentData: any;
  courses: Course[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Solo cargar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadStudentData();
    }
  }

  // Función para cargar los datos del estudiante y los cursos
  loadStudentData() {
    // Usar StorageService en lugar de localStorage
    const token = this.storageService.getItem('token');
    const studentId = this.storageService.getItem('studentId');

    if (!token || !studentId) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener los datos del estudiante
    this.authService.getStudentData(studentId, token).subscribe(
      (data) => {
        this.studentData = data;
        this.loadCourses(data.curso_idcurso);
      },
      (error) => {
        console.error('Error al obtener los datos del estudiante', error);
        this.router.navigate(['/login']);
      }
    );
  }

  // Función para cargar los cursos del estudiante
  loadCourses(studentCourses: string[]) {
    // Usar StorageService en lugar de localStorage
    const token = this.storageService.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Obtener los cursos
    this.authService.getCourses(token).subscribe(
      (courses) => {
        // Filtrar los cursos que tiene asignado el estudiante
        this.courses = courses.items.filter((course: any) =>
          studentCourses.includes(course.id)
        );

        // Asignar color y portada para cada curso
        this.courses = this.courses.map((course: any) => {
          const baseUrl = 'http://100.120.141.83:8090/api/files';
          const fileUrl = `${baseUrl}/pbc_25034247/${course.id}/${course.portada}`;

          course.portadaUrl = fileUrl;

          // Asignamos el color del curso dependiendo del lenguaje
          if (course.lenguaje === 'JavaScript') {
            course.color = 'bg-yellow-500';
          } else if (course.lenguaje === 'React') {
            course.color = 'bg-cyan-500';
          } else {
            course.color = 'bg-gray-500';
          }
          return course;
        });

        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los cursos', error);
        this.isLoading = false;
      }
    );
  }

  // Función para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Método para manejar errores de imagen
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
