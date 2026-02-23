import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
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

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  logout() {
    return this.http.post<any>(`${this.API}/logout`, {});
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
