import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// Lógica para poder navegar por las rutas protegidas
export class AuthService {

  private API = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    return this.http.post<any>(`${this.API}/register`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

login(data: any) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => {
        // Guardamos token y nombre para la inicial
        localStorage.setItem('token', res.token);
        localStorage.setItem('userName', res.user.name); 
      })
    );
  }

  logout() {
    return this.http.post<any>(`${this.API}/logout`, {}).pipe(
      finalize(() => localStorage.clear())
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
