import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://100.120.141.83:8090')
  }

  // Función para autenticar al estudiante
  async loginStudent(email: string, password: string): Promise<any> {
    try {

      const authData=  await this.pb.collection('estudiante').authWithPassword(email, password);
      console.log(authData);
      return authData;

    } catch (error) {
      console.error('Error al iniciar sesión como estudiante', error);
      throw error;
    }

  }

  // Función para autenticar al mentor
  async loginMentor(email: string, password: string): Promise<any> {
    try {
      return await this.pb.collection('mentor').authWithPassword(email, password);
    } catch (error) {
      console.error('Error al iniciar sesión como mentor', error);
      throw error;
    }
  }
}
