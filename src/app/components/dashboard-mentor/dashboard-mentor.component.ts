import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { isPlatformBrowser } from '@angular/common';

interface ProgrammingLanguage {
  id: string;
  nombreLenguaje: string;
}

// CORRECCIÓN: Actualizar la interface para que coincida con la API
interface Language {
  id: string;
  nombre_idioma: string; // Cambiar a nombre_idioma
}

interface MentorData {
  id: string;
  Nombre: string;
  bibliografia: string;
  teams: string;
  departamento: string;
  Linea: boolean;
  lenguajep_idlenguajep: string[];
  idioma_ididioma: string[];
  verified: boolean;
  email?: string;
}

@Component({
  selector: 'app-dashboard-mentor',
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    FormsModule
  ],
  templateUrl: './dashboard-mentor.component.html',
  styleUrl: './dashboard-mentor.component.css'
})
export class DashboardMentorComponent implements OnInit {
  isLoading = true;
  error: string | null = null;

  // Datos del mentor
  mentorData: MentorData | null = null;

  // Estado en línea
  isOnline = false;

  // Datos del perfil para edición
  profileData = {
    name: '',
    title: '',
    bio: '',
    department: '',
    teams: '',
    languages: [] as string[],
    programmingLanguages: [] as string[]
  };

  // Para agregar nuevos items
  newLanguage = '';
  newProgrammingLanguage = '';

  // Estadísticas simuladas
  stats = {
    totalStudents: 0,
    sessionsToday: 0,
    rating: 4.8,
    completedSessions: 0
  };

  // Datos de referencia
  bolivianDepartments = [
    'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí',
    'Tarija', 'Chuquisaca', 'Beni', 'Pando'
  ];

  availableLanguages: Language[] = [];
  availableProgrammingLanguages: ProgrammingLanguage[] = [];

  // Lista de nombres de idiomas y lenguajes para mostrar
  languageNames: { [key: string]: string } = {};
  programmingLanguageNames: { [key: string]: string } = {};

  currentTab = 'overview';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMentorData().catch(error => {
        console.error('Error during initialization:', error);
      });
    }
  }

  async loadMentorData(): Promise<void> {
    const token = this.storageService.getItem('token');
    const mentorId = this.storageService.getItem('mentorId');

    if (!token || !mentorId) {
      await this.router.navigate(['/login']);
      return;
    }

    try {
      // Cargar datos en paralelo
      const [mentorResponse, languagesResponse, programmingLanguagesResponse] = await Promise.all([
        this.authService.getMentorData(mentorId, token).toPromise(),
        this.authService.getLanguages(token).toPromise(),
        this.authService.getProgrammingLanguages(token).toPromise()
      ]);

      this.mentorData = mentorResponse;
      this.availableLanguages = languagesResponse.items || [];
      this.availableProgrammingLanguages = programmingLanguagesResponse.items;

      console.log('Idiomas cargados:', this.availableLanguages); // Debug temporal

      // Crear mapas de nombres
      this.createNameMaps();

      // Configurar datos del perfil
      this.setupProfileData();

      // Generar estadísticas simuladas
      this.generateStats();

      this.isLoading = false;
    } catch (error) {
      console.error('Error al cargar datos del mentor:', error);
      this.error = 'Error al cargar los datos. Por favor, intenta de nuevo.';
      this.isLoading = false;
    }
  }

  createNameMaps(): void {
    // CORRECCIÓN: Mapear IDs de idiomas usando el campo correcto
    this.availableLanguages.forEach(lang => {
      this.languageNames[lang.id] = lang.nombre_idioma; // Usar nombre_idioma
    });

    // Mapear IDs de lenguajes de programación a nombres
    this.availableProgrammingLanguages.forEach(lang => {
      this.programmingLanguageNames[lang.id] = lang.nombreLenguaje;
    });

    console.log('Mapas creados:', {
      languageNames: this.languageNames,
      programmingLanguageNames: this.programmingLanguageNames
    }); // Debug temporal
  }

  setupProfileData(): void {
    if (!this.mentorData) return;

    // Mapear idiomas con verificación
    const mappedLanguages = this.mentorData.idioma_ididioma
      .map(id => this.languageNames[id])
      .filter((name): name is string => !!name);

    this.profileData = {
      name: this.mentorData.Nombre,
      title: 'Mentor Especializado',
      bio: this.mentorData.bibliografia,
      department: this.mentorData.departamento,
      teams: this.mentorData.teams,
      languages: mappedLanguages,
      programmingLanguages: this.mentorData.lenguajep_idlenguajep
        .map(id => this.programmingLanguageNames[id])
        .filter((name): name is string => !!name)
    };

    console.log('Profile data configurado:', this.profileData); // Debug temporal

    // Configurar estado en línea con verificación de null
    this.isOnline = this.mentorData?.Linea ?? false;
  }

  generateStats(): void {
    this.stats = {
      totalStudents: Math.floor(Math.random() * 50) + 10,
      sessionsToday: Math.floor(Math.random() * 5),
      rating: parseFloat((Math.random() + 4).toFixed(1)),
      completedSessions: Math.floor(Math.random() * 200) + 50
    };
  }

  async handleOnlineToggle(): Promise<void> {
    if (!this.mentorData) return;

    const token = this.storageService.getItem('token');
    if (!token) return;

    try {
      const updateData = { Linea: this.isOnline };
      await this.authService.updateMentor(this.mentorData.id, updateData, token).toPromise();

      // Actualizar el dato local
      this.mentorData.Linea = this.isOnline;

      console.log('Estado actualizado:', this.isOnline ? 'En línea' : 'Fuera de línea');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      // Revertir el cambio si hay error
      this.isOnline = !this.isOnline;
    }
  }

  setTab(tab: string): void {
    this.currentTab = tab;
  }

  addLanguage(): void {
    if (this.newLanguage && !this.profileData.languages.includes(this.newLanguage)) {
      this.profileData.languages = [...this.profileData.languages, this.newLanguage];
      this.newLanguage = '';
    }
  }

  removeLanguage(language: string): void {
    this.profileData.languages = this.profileData.languages.filter(l => l !== language);
  }

  addProgrammingLanguage(): void {
    if (this.newProgrammingLanguage && !this.profileData.programmingLanguages.includes(this.newProgrammingLanguage)) {
      this.profileData.programmingLanguages = [...this.profileData.programmingLanguages, this.newProgrammingLanguage];
      this.newProgrammingLanguage = '';
    }
  }

  removeProgrammingLanguage(language: string): void {
    this.profileData.programmingLanguages = this.profileData.programmingLanguages.filter(l => l !== language);
  }

  async handleSaveProfile(): Promise<void> {
    if (!this.mentorData) return;

    const token = this.storageService.getItem('token');
    if (!token) return;

    try {
      // CORRECCIÓN: Convertir nombres de vuelta a IDs usando el campo correcto
      const languageIds = this.profileData.languages
        .map(name => {
          const lang = this.availableLanguages.find(l => l.nombre_idioma === name); // Usar nombre_idioma
          return lang?.id;
        })
        .filter((id): id is string => !!id);

      const programmingLanguageIds = this.profileData.programmingLanguages
        .map(name => {
          const lang = this.availableProgrammingLanguages.find(l => l.nombreLenguaje === name);
          return lang?.id;
        })
        .filter((id): id is string => !!id);

      const updateData = {
        Nombre: this.profileData.name,
        bibliografia: this.profileData.bio,
        departamento: this.profileData.department,
        teams: this.profileData.teams,
        idioma_ididioma: languageIds,
        lenguajep_idlenguajep: programmingLanguageIds
      };

      console.log('Datos a actualizar:', updateData); // Debug temporal

      await this.authService.updateMentor(this.mentorData.id, updateData, token).toPromise();

      // Actualizar datos locales
      this.mentorData = { ...this.mentorData, ...updateData };

      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      alert('Error al guardar el perfil. Por favor, intenta de nuevo.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).catch(error => {
      console.error('Error navigating to login:', error);
    });
  }

  getAvatar(): string {
    if (!this.mentorData?.Nombre) return 'MT';
    const words = this.mentorData.Nombre.split(' ');
    if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return this.mentorData.Nombre.substring(0, 2).toUpperCase();
  }
}
