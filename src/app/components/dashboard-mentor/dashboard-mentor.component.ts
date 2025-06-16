import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-mentor',
  imports: [],
  templateUrl: './dashboard-mentor.component.html',
  styleUrl: './dashboard-mentor.component.css'
})
export class DashboardMentorComponent {
  isOnline = false;

  profileData = {
    name: 'Mentor Demo',
    title: 'Senior Developer',
    bio: 'Desarrollador con más de 5 años de experiencia en JavaScript y tecnologías web modernas.',
    department: 'La Paz',
    languages: ['Español', 'Inglés'],
    programmingLanguages: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
  };

  newLanguage = '';
  newProgrammingLanguage = '';

  stats = {
    totalStudents: 47,
    sessionsToday: 3,
    rating: 4.9,
    completedSessions: 156,
  };

  bolivianDepartments = [
    'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí',
    'Tarija', 'Chuquisaca', 'Beni', 'Pando'
  ];

  availableLanguages = ['Español', 'Inglés', 'Portugués', 'Francés', 'Alemán'];

  availableProgrammingLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
    'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Flask', 'Spring', 'Laravel'
  ];

  currentTab = 'overview';

  handleOnlineToggle(value: boolean) {
    this.isOnline = value;
  }

  setTab(tab: string) {
    this.currentTab = tab;
  }

  addLanguage() {
    if (this.newLanguage && !this.profileData.languages.includes(this.newLanguage)) {
      this.profileData.languages = [...this.profileData.languages, this.newLanguage];
      this.newLanguage = '';
    }
  }

  removeLanguage(language: string) {
    this.profileData.languages = this.profileData.languages.filter((l) => l !== language);
  }

  addProgrammingLanguage() {
    if (
      this.newProgrammingLanguage &&
      !this.profileData.programmingLanguages.includes(this.newProgrammingLanguage)
    ) {
      this.profileData.programmingLanguages = [...this.profileData.programmingLanguages, this.newProgrammingLanguage];
      this.newProgrammingLanguage = '';
    }
  }

  removeProgrammingLanguage(language: string) {
    this.profileData.programmingLanguages = this.profileData.programmingLanguages.filter((l) => l !== language);
  }

  handleSaveProfile() {
    alert('Perfil actualizado correctamente');
  }

}
