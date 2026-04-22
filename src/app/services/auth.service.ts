import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // private API = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string; password_confirmation: string; role: string }) {
    return this.http.post<any>(`${environment.apiUrl}/register`, data).pipe(
      tap((res) => {
        this.saveSession(res.token, res.user);
      })
    );
  }
  

  login(data: any) {
    return this.http.post<any>(`${environment.apiUrl}/login`, data).pipe(
      tap(res => {
        this.saveSession(res.token, res.user);
      })
    );
  }

  // Función auxiliar para no repetir código de guardado
  private saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userRole', user.role); 
  }

  logout() {
    return this.http.post<any>(`${environment.apiUrl}/logout`, {}).pipe(
      finalize(() => localStorage.clear())
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método extra útil para tus Guards de rutas
  getRole(): string | null {
    return localStorage.getItem('userRole');
  }
  getCandidates(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiUrl}/candidates`);
}
  
}