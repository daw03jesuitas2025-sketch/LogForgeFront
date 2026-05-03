import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  // Aseguramos que la URL sea correcta
  private apiUrl = `https://${environment.apiUrl}/api/company`;

  constructor(private http: HttpClient) { }

  /**
   * Método privado para centralizar los headers con el Token.
   * IMPORTANTE: No añadimos 'Content-Type' manualmente cuando usamos FormData,
   * ya que el navegador debe insertar el 'boundary' automáticamente.
   */
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // Obtener el perfil de la empresa autenticada
  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-profile`, this.getHeaders());
  }

  /**
   * Editar perfil de empresa.
   * Como usas FormData para el logo, Laravel requiere que la petición sea POST 
   * y que incluyas el campo '_method' con valor 'PUT' en el FormData del componente.
   */
  updateProfile(data: any): Observable<any> {
    // Si es FormData (para subir imágenes), forzamos POST para evitar problemas con PUT
    if (data instanceof FormData) {
      return this.http.post(`${this.apiUrl}/my-profile`, data, this.getHeaders());
    }
    // Si es JSON normal, usamos PUT
    return this.http.put(`${this.apiUrl}/my-profile`, data, this.getHeaders());
  }

  // Obtener las ofertas que ha publicado la empresa (incluye el conteo de candidatos)
  getMyOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-offers`, this.getHeaders());
  }

  // Obtener el listado general de candidatos (usuarios rol 'user')
  getCandidates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidates`, this.getHeaders());
  }

  /**
   * Ver candidatos que se han postulado a una oferta concreta.
   * La ruta coincide con: company/job-offers/{id}/applications
   */
  getOfferApplications(offerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/job-offers/${offerId}/applications`, this.getHeaders());
  }
}