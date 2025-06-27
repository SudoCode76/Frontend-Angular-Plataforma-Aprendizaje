import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { StorageService } from './storage.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
    this.sessionService.setSession(authData.record, authData.token);
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

  // Función para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.sessionService.isAuthenticated();
    }
    return false;
  }

  // Función para obtener el token
  getToken(): string | null {
    return this.storageService.getItem('token');
  }

  // Función para cerrar sesión
  logout(): void {
    this.sessionService.clearSession();
  }

  getModulesByCourse(courseId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/modulo/records?id=${courseId}`, { headers });
  }

  // Obtener un módulo específico por ID
  getModuleById(moduleId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/modulo/records/${moduleId}`, { headers });
  }

  // Obtener todas las lecciones
  getLessons(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://100.120.141.83:8090/api/collections/leccion/records', { headers });
  }

  // Obtener una lección específica por ID
  getLessonById(lessonId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/leccion/records/${lessonId}`, { headers });
  }


  // Obtener lenguajes de programación
  getProgrammingLanguages(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://100.120.141.83:8090/api/collections/lenguajeProgramacion/records', { headers });
  }

// Obtener mentores
  getMentors(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://100.120.141.83:8090/api/collections/mentor/records', { headers });
  }

// Obtener mentores por lenguaje
  getMentorsByLanguage(languageId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/mentor/records?filter=(lenguajep_idlenguajep~"${languageId}")`, { headers });
  }


  // Obtener datos del mentor
  getMentorData(mentorId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://100.120.141.83:8090/api/collections/mentor/records/${mentorId}`, { headers });
  }

// Actualizar mentor
  updateMentor(mentorId: string, mentorData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<any>(`http://100.120.141.83:8090/api/collections/mentor/records/${mentorId}`, mentorData, { headers });
  }

// Obtener idiomas
  getLanguages(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://100.120.141.83:8090/api/collections/idioma/records', { headers });
  }
}
