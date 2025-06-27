import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NgForOf, NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

interface Lesson {
  id: string;
  titulo: string;
  contenido: string;
  contenido_texto: string;
  ordenIndice: number;
}

interface Module {
  id: string;
  titulo: string;
  descripcion: string;
  ordenIndice: number;
  leccion_idleccion: string[];
}

@Component({
  selector: 'app-leccion',
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './leccion.component.html',
  styleUrls: ['./leccion.component.css']
})
export class LeccionComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  courseId!: string;
  moduleId!: string;
  moduleData: Module | null = null;
  lessons: Lesson[] = [];
  selectedLesson: Lesson | null = null;
  isLoading = true;
  videoError: string | null = null;
  videoLoading = false;
  videoProgress = 0;
  showHelpModal = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') || '';

    if (!this.courseId || !this.moduleId) {
      this.router.navigate(['/estudiante/dashboard']);
      return;
    }

    // Solo cargar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadModuleAndLessons();
    }
  }

  loadModuleAndLessons() {
    // Usar el StorageService en lugar de localStorage directamente
    const token = this.storageService.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getModuleById(this.moduleId, token).subscribe(
      (moduleData) => {
        this.moduleData = moduleData;
        this.loadLessons(moduleData.leccion_idleccion, token);
      },
      (error) => {
        console.error('Error al obtener el módulo', error);
        this.isLoading = false;
      }
    );
  }

  loadLessons(lessonIds: string[], token: string) {
    this.authService.getLessons(token).subscribe(
      (data) => {
        this.lessons = data.items.filter((lesson: any) =>
          lessonIds.includes(lesson.id)
        );

        this.lessons = this.lessons.sort((a, b) => a.ordenIndice - b.ordenIndice);

        if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0]);
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener las lecciones', error);
        this.isLoading = false;
      }
    );
  }

  selectLesson(lesson: Lesson) {
    this.selectedLesson = lesson;
    this.videoError = null;
    this.videoLoading = true;
    this.videoProgress = 0;

    // Solo hacer scroll si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const videoElement = document.querySelector('video');
        if (videoElement) {
          videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  getVideoUrl(lesson: Lesson): string {
    const baseUrl = 'http://100.120.141.83:8090/api/files';
    const collectionId = 'pbc_3765995012';
    return `${baseUrl}/${collectionId}/${lesson.id}/${lesson.contenido}`;
  }

  onVideoError(event: any) {
    console.error('Error de video:', event);
    this.videoError = 'No se pudo cargar el video. Verifica que el archivo existe y es accesible.';
    this.videoLoading = false;
  }

  onVideoLoaded() {
    this.videoLoading = false;
  }

  onTimeUpdate(event: any) {
    const video = event.target;
    if (video.duration > 0) {
      this.videoProgress = Math.round((video.currentTime / video.duration) * 100);
    }
  }

  retryVideo() {
    this.videoError = null;
    this.videoLoading = true;
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.load();
    }
  }

  getFileType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4': return 'MP4';
      case 'webm': return 'WebM';
      case 'mov': return 'MOV';
      case 'avi': return 'AVI';
      default: return 'Video';
    }
  }

  getPreviousLesson(): Lesson | null {
    if (!this.selectedLesson) return null;
    const currentIndex = this.lessons.findIndex(l => l.id === this.selectedLesson!.id);
    return currentIndex > 0 ? this.lessons[currentIndex - 1] : null;
  }

  getNextLesson(): Lesson | null {
    if (!this.selectedLesson) return null;
    const currentIndex = this.lessons.findIndex(l => l.id === this.selectedLesson!.id);
    return currentIndex < this.lessons.length - 1 ? this.lessons[currentIndex + 1] : null;
  }

  getCurrentLessonIndex(): number {
    if (!this.selectedLesson) return 0;
    return this.lessons.findIndex(l => l.id === this.selectedLesson!.id) + 1;
  }

  getProgressPercentage(): number {
    if (this.lessons.length === 0) return 0;
    return (this.getCurrentLessonIndex() / this.lessons.length) * 100;
  }

  // Funciones para el modal de ayuda
  requestHelpWithLesson() {
    this.showHelpModal = true;
  }

  closeHelpModal() {
    this.showHelpModal = false;
  }

  connectWithMentor() {
    console.log('Conectando con mentor para la lección:', this.selectedLesson?.titulo);

    this.router.navigate(['/estudiante/encontrar-mentor'], {
      queryParams: {
        lessonId: this.selectedLesson?.id,
        lessonTitle: this.selectedLesson?.titulo,
        moduleId: this.moduleId,
        courseId: this.courseId
      }
    });

    this.closeHelpModal();
  }
}
