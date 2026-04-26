import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Asegúrate de tener tu URL de API aquí

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
private apiUrl = `${environment.apiUrl}/company`;

  constructor(private http: HttpClient) {}

  // Obtener el perfil de la empresa autenticada
getMyProfile(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/company/my-profile`);
}

  // Obtener las ofertas de esta empresa
  getMyOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-offers`);
  }

  // Obtener candidatos (estudiantes)
  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidates`);
  }
}