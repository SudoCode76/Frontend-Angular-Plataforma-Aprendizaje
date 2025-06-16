import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-encontrar-mentor',
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './encontrar-mentor.component.html',
  styleUrl: './encontrar-mentor.component.css'
})
export class EncontrarMentorComponent {
  selectedLanguage = '';

  languages = [
    { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500', icon: 'JS', mentorsOnline: 5 },
    { id: 'python', name: 'Python', color: 'bg-blue-500', icon: 'PY', mentorsOnline: 3 },
    { id: 'react', name: 'React', color: 'bg-cyan-500', icon: 'RC', mentorsOnline: 4 },
    { id: 'java', name: 'Java', color: 'bg-orange-500', icon: 'JV', mentorsOnline: 2 },
    { id: 'typescript', name: 'TypeScript', color: 'bg-blue-600', icon: 'TS', mentorsOnline: 3 },
    { id: 'cpp', name: 'C++', color: 'bg-purple-500', icon: 'C++', mentorsOnline: 1 },
    { id: 'html-css', name: 'HTML/CSS', color: 'bg-green-500', icon: 'HC', mentorsOnline: 2 },
    { id: 'nodejs', name: 'Node.js', color: 'bg-green-600', icon: 'NJ', mentorsOnline: 3 },
  ];

  mentorsByLanguage: any = {
    javascript: [
      {
        id: 1,
        name: "Dr. JavaScript",
        specialties: ["JavaScript", "React", "Node.js"],
        rating: 4.9,
        totalSessions: 156,
        experience: "5+ años",
        teamsId: "drjavascript@company.com",
        avatar: "DJ",
        status: "online",
        description: "Experto en JavaScript moderno, React y desarrollo full-stack",
      },
      {
        id: 2,
        name: "JS Master",
        specialties: ["JavaScript", "TypeScript", "Vue.js"],
        rating: 4.8,
        totalSessions: 89,
        experience: "3+ años",
        teamsId: "jsmaster@company.com",
        avatar: "JM",
        status: "online",
        description: "Especialista en JavaScript avanzado y frameworks modernos",
      },
      {
        id: 3,
        name: "Frontend Guru",
        specialties: ["JavaScript", "React", "CSS"],
        rating: 4.7,
        totalSessions: 203,
        experience: "6+ años",
        teamsId: "frontendguru@company.com",
        avatar: "FG",
        status: "online",
        description: "Experto en desarrollo frontend y experiencia de usuario",
      },
    ],
    python: [
      {
        id: 4,
        name: "Python Master",
        specialties: ["Python", "Django", "Data Science"],
        rating: 4.9,
        totalSessions: 134,
        experience: "4+ años",
        teamsId: "pythonmaster@company.com",
        avatar: "PM",
        status: "online",
        description: "Especialista en Python, desarrollo web y ciencia de datos",
      },
      {
        id: 5,
        name: "Data Scientist",
        specialties: ["Python", "Machine Learning", "Pandas"],
        rating: 4.8,
        totalSessions: 78,
        experience: "3+ años",
        teamsId: "datascientist@company.com",
        avatar: "DS",
        status: "online",
        description: "Experto en Python para análisis de datos y machine learning",
      },
    ],
    react: [
      {
        id: 6,
        name: "React Guru",
        specialties: ["React", "Next.js", "Redux"],
        rating: 4.9,
        totalSessions: 167,
        experience: "5+ años",
        teamsId: "reactguru@company.com",
        avatar: "RG",
        status: "online",
        description: "Experto en React, Next.js y arquitectura de aplicaciones",
      },
      {
        id: 7,
        name: "Component Expert",
        specialties: ["React", "Styled Components", "Testing"],
        rating: 4.7,
        totalSessions: 92,
        experience: "3+ años",
        teamsId: "componentexpert@company.com",
        avatar: "CE",
        status: "online",
        description: "Especialista en componentes React y testing",
      },
    ],
  };

  get selectedLanguageData() {
    return this.languages.find(lang => lang.id === this.selectedLanguage);
  }

  get availableMentors() {
    return this.selectedLanguage
      ? this.mentorsByLanguage[this.selectedLanguage] || []
      : [];
  }

  handleContactMentor(teamsId: string, mentorName: string) {
    const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${teamsId}&message=Hola ${mentorName}, necesito ayuda con ${this.selectedLanguage}. ¿Podrías ayudarme?`;
    window.open(teamsUrl, "_blank");
  }

  setLanguage(langId: string) {
    this.selectedLanguage = langId;
  }

  clearLanguage() {
    this.selectedLanguage = '';
  }

}
