import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- Métodos de Perfil ---
  getFullProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, this.getHeaders());
  }

  // --- Métodos de Skills (NUEVO) ---
  getSkills(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/profile/skills`, this.getHeaders());
  }

  // --- Métodos de Experiencia ---
  addExperience(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/experiences`, data, this.getHeaders());
  }

  updateExperience(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/experiences/${id}`, data, this.getHeaders());
  }

  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/experiences/${id}`, this.getHeaders());
  }

// Obtener todas las skills maestras para el selector
getAvailableSkills(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/skills/available`);
}

// Enviar los IDs elegidos por el usuario (Sincronizar)
syncSkills(skillIds: number[]) {
  return this.http.post(`${this.apiUrl}/profile/skills/sync`, { 
    skills: skillIds 
  });
}
addSkill(data: { name: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/skills`, data);
}
addEducation(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/educations`, data);
}

updateEducation(id: number, data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/educations/${id}`, data);
}
show(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
}