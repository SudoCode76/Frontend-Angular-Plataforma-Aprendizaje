import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionService} from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private sessionService: SessionService) {}

  // Función para autenticar al estudiante
  loginStudent(email: string, password: string): Observable<any> {
    const body = { identity: email, password: password };
    return this.http.post<any>('http://100.120.141.83:8090/api/collections/estudiante/auth-with-password', body);
  }

  // Función para autenticar al mentor
  loginMentor(email: string, password: string): Observable<any> {
    const body = { identity: email, password: password };
    return this.http.post<any>('http://100.120.141.83:8090/api/collections/mentor/auth-with-password', body);
  }

  // Función para guardar los datos del usuario en la sesión
  storeUserData(authData: any): void {
    this.sessionService.setSession(authData.record, authData.token);  // Guardamos en el servicio de sesión
  }

  // Función para obtener los datos del estudiante
  getStudentData(studentId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/estudiante/records/${studentId}`, { headers });
  }

  // Obtener cursos
  getCourses(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://100.120.141.83:8090/api/collections/curso/records', { headers });
  }

  // Obtener lecciones de un curso
  getLessons(courseId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/leccion/records?curso_idcurso=${courseId}`, { headers });
  }

  // Función para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.sessionService.isAuthenticated();  // Usamos el servicio de sesión para verificar la autenticación
  }

  // Función para obtener el token
  getToken(): string | null {
    return this.sessionService.getToken();
  }

  // Función para cerrar sesión
  logout(): void {
    this.sessionService.clearSession();  // Limpiamos la sesión
  }

  getModulesByCourse(courseId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/modulo/records?id=${courseId}`, { headers });
  }
}
