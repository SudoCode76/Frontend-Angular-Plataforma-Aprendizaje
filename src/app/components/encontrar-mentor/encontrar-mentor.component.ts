import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { isPlatformBrowser } from '@angular/common';

interface ProgrammingLanguage {
  id: string;
  nombreLenguaje: string;
  color: string;
  icon: string;
  mentorsOnline: number;
}

interface Mentor {
  id: string;
  Nombre: string;
  bibliografia: string;
  teams: string;
  departamento: string;
  Linea: boolean;
  lenguajep_idlenguajep: string[];
  verified: boolean;
  avatar: string;
  specialties: string[];
  rating: number;
  totalSessions: number;
  experience: string;
}

@Component({
  selector: 'app-encontrar-mentor',
  imports: [

    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './encontrar-mentor.component.html',
  styleUrl: './encontrar-mentor.component.css'
})
export class EncontrarMentorComponent implements OnInit {
  selectedLanguage = '';
  languages: ProgrammingLanguage[] = [];
  allMentors: Mentor[] = [];
  isLoading = true;
  error: string | null = null;

  // Colores predefinidos para lenguajes
  private languageColors: { [key: string]: { color: string, icon: string } } = {
    'JavaScript': { color: 'bg-yellow-500', icon: 'JS' },
    'React': { color: 'bg-cyan-500', icon: 'RC' },
    'Python': { color: 'bg-blue-500', icon: 'PY' },
    'Java': { color: 'bg-orange-500', icon: 'JV' },
    'TypeScript': { color: 'bg-blue-600', icon: 'TS' },
    'C++': { color: 'bg-purple-500', icon: 'C++' },
    'C#': { color: 'bg-purple-600', icon: 'C#' },
    'HTML/CSS': { color: 'bg-green-500', icon: 'HC' },
    'Node.js': { color: 'bg-green-600', icon: 'NJ' },
    'Angular': { color: 'bg-red-500', icon: 'NG' },
    'Vue.js': { color: 'bg-green-400', icon: 'VU' },
    'PHP': { color: 'bg-indigo-500', icon: 'PHP' }
  };

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  async loadData() {
    const token = this.storageService.getItem('token');

    if (!token) {
      this.error = 'No se encontró el token de autenticación';
      this.isLoading = false;
      return;
    }

    try {
      // Cargar lenguajes y mentores en paralelo
      const [languagesResponse, mentorsResponse] = await Promise.all([
        this.authService.getProgrammingLanguages(token).toPromise(),
        this.authService.getMentors(token).toPromise()
      ]);

      this.processLanguages(languagesResponse.items);
      this.processMentors(mentorsResponse.items);
      this.calculateMentorsPerLanguage();

      this.isLoading = false;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.error = 'Error al cargar los datos. Por favor, intenta de nuevo.';
      this.isLoading = false;
    }
  }

  processLanguages(languagesData: any[]) {
    this.languages = languagesData.map(lang => {
      const styleData = this.languageColors[lang.nombreLenguaje] ||
        { color: 'bg-gray-500', icon: lang.nombreLenguaje.substring(0, 2).toUpperCase() };

      return {
        id: lang.id,
        nombreLenguaje: lang.nombreLenguaje,
        color: styleData.color,
        icon: styleData.icon,
        mentorsOnline: 0 // Se calculará después
      };
    });
  }

  processMentors(mentorsData: any[]) {
    this.allMentors = mentorsData
      .filter(mentor => mentor.Linea) // Solo mentores en línea
      .map(mentor => ({
        id: mentor.id,
        Nombre: mentor.Nombre,
        bibliografia: mentor.bibliografia,
        teams: mentor.teams,
        departamento: mentor.departamento,
        Linea: mentor.Linea,
        lenguajep_idlenguajep: mentor.lenguajep_idlenguajep,
        verified: mentor.verified,
        avatar: this.generateAvatar(mentor.Nombre),
        specialties: this.generateSpecialties(mentor.lenguajep_idlenguajep),
        rating: this.generateRating(),
        totalSessions: this.generateSessions(),
        experience: this.generateExperience()
      }));
  }

  calculateMentorsPerLanguage() {
    this.languages.forEach(language => {
      const mentorsCount = this.allMentors.filter(mentor =>
        mentor.lenguajep_idlenguajep.includes(language.id)
      ).length;
      language.mentorsOnline = mentorsCount;
    });
  }

  generateAvatar(name: string): string {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  generateSpecialties(languageIds: string[]): string[] {
    const languageNames = languageIds.map(id => {
      const lang = this.languages.find(l => l.id === id);
      return lang ? lang.nombreLenguaje : 'Programación';
    });

    // Agregar algunas especialidades adicionales aleatorias
    const additionalSpecialties = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Web Development'];
    const randomSpecialties = additionalSpecialties
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);

    return [...languageNames, ...randomSpecialties];
  }

  generateRating(): number {
    return Math.round((Math.random() * 1 + 4) * 10) / 10; // Entre 4.0 y 5.0
  }

  generateSessions(): number {
    return Math.floor(Math.random() * 200) + 20; // Entre 20 y 220
  }

  generateExperience(): string {
    const years = Math.floor(Math.random() * 8) + 2; // Entre 2 y 10 años
    return `${years}+ años`;
  }

  get selectedLanguageData() {
    return this.languages.find(lang => lang.id === this.selectedLanguage);
  }

  get availableMentors() {
    if (!this.selectedLanguage) return [];

    return this.allMentors.filter(mentor =>
      mentor.lenguajep_idlenguajep.includes(this.selectedLanguage)
    );
  }

  handleContactMentor(teamsId: string, mentorName: string) {
    const selectedLang = this.selectedLanguageData?.nombreLenguaje || 'programación';
    const message = `Hola ${mentorName}, necesito ayuda con ${selectedLang}. ¿Podrías ayudarme?`;
    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${teamsId}&message=${encodeURIComponent(message)}`;
    window.open(teamsUrl, "_blank");
  }

  setLanguage(langId: string) {
    this.selectedLanguage = langId;
  }

  clearLanguage() {
    this.selectedLanguage = '';
  }
}
