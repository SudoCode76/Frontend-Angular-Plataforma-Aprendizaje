import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForOf, NgIf } from '@angular/common';

interface Module {
  id: string;
  titulo: string;
  descripcion: string;
  ordenIndice: number;
  leccion_idleccion: string[];
}

@Component({
  selector: 'app-modulo',
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.css']
})
export class ModuloComponent implements OnInit {
  courseId!: string;  // ID del curso actual
  modules: Module[] = [];  // Array para almacenar los módulos del curso
  isLoading = true;  // Para mostrar un cargador mientras obtenemos los datos
  courseData: any;  // Para almacenar la información del curso (incluyendo los módulos asociados)

  constructor(
    private route: ActivatedRoute,  // Para obtener el ID del curso desde la URL
    private authService: AuthService,  // Servicio para hacer peticiones a la API
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del curso desde la URL
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.courseId) {
      this.router.navigate(['/estudiante/dashboard']);  // Si no hay curso, redirigir a la lista de cursos
      return;
    }

    this.loadCourseAndModules();  // Cargar el curso y los módulos del curso
  }

  // Función para cargar los datos del curso y los módulos asociados
  loadCourseAndModules() {
    const token = localStorage.getItem('token');  // Obtener el token desde el localStorage

    if (!token) {
      this.router.navigate(['/login']);  // Si no hay sesión, redirigir a login
      return;
    }

    // Primero, cargar los datos del curso
    this.authService.getCourses(token).subscribe(
      (courses) => {
        // Buscar el curso seleccionado
        const course = courses.items.find((course: any) => course.id === this.courseId);

        if (!course) {
          this.router.navigate(['/estudiante/dashboard']);  // Si no se encuentra el curso, redirigir al dashboard
          return;
        }

        this.courseData = course;  // Asignar los datos del curso
        this.loadModules(course.modulo_idmodulo, token);  // Cargar los módulos del curso
      },
      (error) => {
        console.error('Error al obtener los cursos', error);
        this.isLoading = false;  // Detener el cargador
      }
    );
  }

  // Función para cargar los módulos del curso desde la API
  loadModules(moduleIds: string[], token: string) {
    this.authService.getModulesByCourse(this.courseId, token).subscribe(
      (data) => {
        // Filtrar los módulos para solo mostrar los que están asociados al curso
        this.modules = data.items.filter((module: any) => moduleIds.includes(module.id));

        // Ordenar los módulos por el campo ordenIndice
        this.modules = this.modules.sort((a: any, b: any) => a.ordenIndice - b.ordenIndice);

        this.isLoading = false;  // Detener el cargador
      },
      (error) => {
        console.error('Error al obtener los módulos', error);
        this.isLoading = false;  // Detener el cargador
      }
    );
  }

  // Redirigir a las lecciones de un módulo
  goToLessons(moduleId: string) {
    this.router.navigate([`/estudiante/modulo/${this.courseId}/lecciones/${moduleId}`]);  // Redirigir a las lecciones del módulo
  }
}
