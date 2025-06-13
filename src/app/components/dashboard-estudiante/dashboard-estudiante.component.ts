import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard-estudiante',
  imports: [
    RouterLink,
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './dashboard-estudiante.component.html',
  styleUrl: './dashboard-estudiante.component.css'
})
export class DashboardEstudianteComponent {
  selectedLanguage = 'javascript';

  languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      progress: 65,
      color: 'bg-yellow-500',
      lessons: 24,
      completed: 16,
    },
    {
      id: 'python',
      name: 'Python',
      progress: 30,
      color: 'bg-blue-500',
      lessons: 20,
      completed: 6,
    },
    {
      id: 'react',
      name: 'React',
      progress: 0,
      color: 'bg-cyan-500',
      lessons: 18,
      completed: 0,
    },
  ];

  lessons = [
    {
      id: 1,
      title: 'Variables y Tipos de Datos',
      description: 'Aprende sobre let, const y var',
      difficulty: 'Principiante',
      duration: '15 min',
      completed: true,
      locked: false,
      xp: 50,
    },
    {
      id: 2,
      title: 'Funciones en JavaScript',
      description: 'Crea y usa funciones efectivamente',
      difficulty: 'Principiante',
      duration: '20 min',
      completed: true,
      locked: false,
      xp: 75,
    },
    {
      id: 3,
      title: 'Arrays y Métodos',
      description: 'Manipula arrays con métodos modernos',
      difficulty: 'Intermedio',
      duration: '25 min',
      completed: false,
      locked: false,
      xp: 100,
    },
    {
      id: 4,
      title: 'Programación Asíncrona',
      description: 'Promises, async/await y fetch',
      difficulty: 'Avanzado',
      duration: '30 min',
      completed: false,
      locked: true,
      xp: 150,
    },
  ];

  achievements = [
    { name: 'Primera Lección', icon: '🎯', earned: true },
    { name: 'Racha de 7 días', icon: '🔥', earned: true },
    { name: '100 XP', icon: '⭐', earned: true },
    { name: 'Mentor Helper', icon: '🤝', earned: false },
  ];

  recommendedCourses = [
    {
      id: 'javascript-basics',
      title: 'JavaScript Fundamentos',
      description: 'Aprende los conceptos básicos de JavaScript desde cero',
      image: '/placeholder.svg?height=100&width=200',
      progress: 65,
      language: 'JavaScript',
      color: 'bg-yellow-500',
    },
    {
      id: 'python-basics',
      title: 'Python para Principiantes',
      description: 'Domina los fundamentos de Python y la programación',
      image: '/placeholder.svg?height=100&width=200',
      progress: 30,
      language: 'Python',
      color: 'bg-blue-500',
    },
    {
      id: 'react-essentials',
      title: 'React Esencial',
      description: 'Construye aplicaciones web modernas con React',
      image: '/placeholder.svg?height=100&width=200',
      progress: 0,
      language: 'React',
      color: 'bg-cyan-500',
    },
  ];

  activeChats = [
    {
      id: 1,
      mentor: 'Dr. JavaScript',
      avatar: '/placeholder.svg?height=40&width=40',
      language: 'JavaScript',
      lastMessage: 'Recuerda usar async/await correctamente',
      timeAgo: '2h',
      unread: 2,
    },
    {
      id: 2,
      mentor: 'Python Master',
      avatar: '/placeholder.svg?height=40&width=40',
      language: 'Python',
      lastMessage: 'Las clases en Python son diferentes a Java',
      timeAgo: '5h',
      unread: 0,
    },
  ];

  constructor(private router: Router) {}

  setSelectedLanguage(id: string) {
    this.selectedLanguage = id;
  }

}
