import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Asegúrate de tener tu URL de API aquí

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `https://${environment.apiUrl}/api/company`;

  constructor(private http: HttpClient) { }

  // Obtener el perfil de la empresa autenticada
  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-profile`);
  }
  // editar perfil de empresa
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/my-profile`, data);
  }

  // Obtener las ofertas de esta empresa
  getMyOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-offers`);
  }

  // Obtener candidatos (estudiantes)
  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidates`);
  }

  // ver candidatos que se han postulado a una oferta concreta
  getOfferApplications(offerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/job-offers/${offerId}/applications`);
  }
}