import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  private apiUrl = `https://${environment.apiUrl}/api`;
  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // --- Perfil Base ---
  show(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, this.getHeaders());
  }

  updateBasicInfo(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, this.getHeaders());
  }

  // --- Experiencia ---
  addExperience(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/experiences`, data, this.getHeaders());
  }

  updateExperience(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/experiences/${id}`, data, this.getHeaders());
  }

  deleteExperience(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/experiences/${id}`, this.getHeaders());
  }

  // --- Educación ---
  addEducation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/educations`, data, this.getHeaders());
  }

  updateEducation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/educations/${id}`, data, this.getHeaders());
  }

  deleteEducation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/educations/${id}`, this.getHeaders());
  }

  // --- Skills ---
  addSkill(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/skills`, data, this.getHeaders());
  }

  updateSkill(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/skills/${id}`, data, this.getHeaders());
  }

  deleteSkill(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/skills/${id}`, this.getHeaders());
  }
  // Descargar CV / resume como blob
  downloadResume(): Observable<Blob> {
    const token = localStorage.getItem('token');

    // Forzamos los headers correctos
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/profile/resume`, {
      headers: headers,
      responseType: 'blob'
    });
  }
}