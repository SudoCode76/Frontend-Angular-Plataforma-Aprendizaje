import { Component } from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [
    NavbarComponent,
    NgClass,
    NgForOf
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  features = [
    {
      icon: '🎮', // Puedes reemplazar por SVG o icono Angular Material
      title: 'Aprendizaje Gamificado',
      description: 'Aprende jugando y compitiendo con otros estudiantes.'
    },
    {
      icon: '👨‍🏫',
      title: 'Mentores Expertos',
      description: 'Recibe apoyo personalizado de profesionales experimentados.'
    },
    {
      icon: '🌎',
      title: 'Comunidad Global',
      description: 'Forma parte de una comunidad activa que te apoya.'
    },
    {
      icon: '📈',
      title: 'Progreso Medible',
      description: 'Sigue tu avance y celebra tus logros.'
    }
  ];

  languages = [
    {
      name: 'JavaScript',
      color: 'bg-yellow-400',
      students: 16000
    },
    {
      name: 'Python',
      color: 'bg-blue-400',
      students: 14000
    },
    {
      name: 'Java',
      color: 'bg-red-400',
      students: 9000
    },
    {
      name: 'C#',
      color: 'bg-purple-400',
      students: 6000
    },
    {
      name: 'Go',
      color: 'bg-cyan-400',
      students: 3000
    },
    {
      name: 'Ruby',
      color: 'bg-pink-400',
      students: 2000
    }
  ];



  activeFeature: number = 0;

  setActiveFeature(index: number): void {
    this.activeFeature = index;
  }

}
