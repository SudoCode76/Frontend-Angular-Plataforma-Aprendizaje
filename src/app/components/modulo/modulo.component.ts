import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NgForOf, NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

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
  courseId!: string;
  modules: Module[] = [];
  isLoading = true;
  courseData: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.courseId) {
      this.router.navigate(['/estudiante/dashboard']);
      return;
    }

    // Solo cargar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadCourseAndModules();
    }
  }

  loadCourseAndModules() {
    const token = this.storageService.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getCourses(token).subscribe(
      (courses) => {
        const course = courses.items.find((course: any) => course.id === this.courseId);

        if (!course) {
          this.router.navigate(['/estudiante/dashboard']);
          return;
        }

        this.courseData = course;
        this.loadModules(course.modulo_idmodulo, token);
      },
      (error) => {
        console.error('Error al obtener los cursos', error);
        this.isLoading = false;
      }
    );
  }

  loadModules(moduleIds: string[], token: string) {
    this.authService.getModulesByCourse(this.courseId, token).subscribe(
      (data) => {
        this.modules = data.items.filter((module: any) => moduleIds.includes(module.id));
        this.modules = this.modules.sort((a: any, b: any) => a.ordenIndice - b.ordenIndice);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los módulos', error);
        this.isLoading = false;
      }
    );
  }

  goToLessons(moduleId: string) {
    this.router.navigate([`/estudiante/modulo/${this.courseId}/lecciones/${moduleId}`]);
  }

  // Métodos para las estadísticas
  getTotalLessons(): number {
    return this.modules.reduce((total, module) => total + module.leccion_idleccion.length, 0);
  }

  getEstimatedTime(): string {
    const totalLessons = this.getTotalLessons();
    const estimatedMinutes = totalLessons * 15; // Estimamos 15 minutos por lección
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}
