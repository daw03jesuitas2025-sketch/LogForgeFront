import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `https://${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Método privado para obtener el Token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  /**
   * ESTADÍSTICAS
   */
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`, this.getHeaders());
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`, this.getHeaders());
  }

  /**
   * USUARIOS
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`, this.getHeaders());
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, userData, this.getHeaders());
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, data, this.getHeaders());
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`, this.getHeaders());
  }

  /**
   * OFERTAS
   */
  getJobOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/offers`, this.getHeaders());
  }

  toggleOfferStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/offers/${id}/toggle`, {}, this.getHeaders());
  }

deleteOffer(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/admin/offers/${id}`, this.getHeaders());
}

  /**
   * EMPRESAS Y MENSAJES
   */
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/companies`, this.getHeaders());
  }

updateCompanyProfile(id: number, data: any): Observable<any> {
  // Asegúrate de usar this.getHeaders() para que Laravel autorice la petición
  return this.http.put(`${this.apiUrl}/admin/companies/${id}/profile`, data, this.getHeaders());
}

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/messages`, this.getHeaders());
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/messages/${id}`, this.getHeaders());
  }
}