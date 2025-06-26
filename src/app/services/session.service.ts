import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private userData: any;
  private token: string | null = null;


  constructor() { }


  // Guardar los datos del usuario y el token en la sesión
  setSession(user: any, token: string): void {
    this.userData = user;
    this.token = token;
  }

  // Obtener los datos del usuario
  getUser(): any {
    return this.userData;
  }

  // Obtener el token
  getToken(): string | null {
    return this.token;
  }

  // Verificar si hay una sesión activa
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  // Cerrar sesión (limpiar los datos)
  clearSession(): void {
    this.userData = null;
    this.token = null;
  }
}
