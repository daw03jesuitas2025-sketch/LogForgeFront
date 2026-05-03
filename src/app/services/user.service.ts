import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // Si la URL ya tiene http, la usamos. Si no, le ponemos el protocolo y el /api.
    // Esto hace que funcione tanto con tu environment de dev como con el de prod.
    this.baseUrl = environment.apiUrl.includes('http') 
      ? `${environment.apiUrl}/api` 
      : `https://${environment.apiUrl}/api`;
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Obtener postulaciones: GET /api/user/my-applications
  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/my-applications`, this.getHeaders());
  }

  // Obtener mi usuario: GET /api/me
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me`, this.getHeaders());
  }
}