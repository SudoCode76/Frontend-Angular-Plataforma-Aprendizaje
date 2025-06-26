import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
interface Course {
  id: string;
  titulo: string;
  descripcion: string;
  portada: string;
  color?: string;
  portadaUrl?: string;
}

@Component({
  selector: 'app-dashboard-estudiante',
  imports: [
    RouterLink,
    NgForOf,

  ],
  templateUrl: './dashboard-estudiante.component.html',
  styleUrl: './dashboard-estudiante.component.css'
})
export class DashboardEstudianteComponent implements OnInit{
  studentData: any;  // Almacenaremos los datos del estudiante
  courses: Course[] = [];  // Almacenaremos los cursos
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
        this.loadCourses(data.curso_idcurso);  // Cargar los cursos del estudiante según el campo 'curso_idcurso'
      },
      (error) => {
        console.error('Error al obtener los datos del estudiante', error);
        this.router.navigate(['/login']);  // Si hay error, redirigir al login
      }
    );
  }

  // Función para cargar los cursos del estudiante
  loadCourses(studentCourses: string[]) {
    const token = localStorage.getItem('token');  // Recuperar el token de sesión

    if (!token) {
      this.router.navigate(['/login']);  // Si no hay sesión, redirigir a login
      return;
    }

    // Obtener los cursos
    this.authService.getCourses(token).subscribe(
      (courses) => {
        // Filtrar los cursos que tiene asignado el estudiante
        this.courses = courses.items.filter((course: any) =>
          studentCourses.includes(course.id)  // Filtra los cursos por el id del estudiante
        );

        // Asignar color y portada para cada curso
        this.courses = this.courses.map((course: any) => {
          const baseUrl = 'http://100.120.141.83:8090/api/files';  // La URL base para los archivos de PocketBase
          const fileUrl = `${baseUrl}/pbc_25034247/${course.id}/${course.portada}`;  // Construcción de la URL completa

          course.portadaUrl = fileUrl;

          // Asignamos el color del curso dependiendo del lenguaje
          if (course.lenguaje === 'JavaScript') {
            course.color = 'bg-yellow-500';  // Asignar un color para JavaScript
          } else if (course.lenguaje === 'React') {
            course.color = 'bg-cyan-500';  // Asignar un color para React
          } else {
            course.color = 'bg-gray-500';  // Color predeterminado
          }
          return course;
        });

        this.isLoading = false;  // Detener el cargador
      },
      (error) => {
        console.error('Error al obtener los cursos', error);
        this.isLoading = false;  // Detener el cargador
      }
    );
  }

}
