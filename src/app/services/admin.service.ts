import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Definimos una única base para evitar confusiones
  private apiUrl = `https://${environment.apiUrl}/api`;
  constructor(private http: HttpClient) { }
private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }
  /**
   * Obtiene las estadísticas numéricas (Total usuarios, ofertas, etc.)
   */
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }

  /**
   * Obtiene la lista de usuarios para la tabla
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, userData);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`);
  }

  /**
   * Obtiene la lista de ofertas de trabajo
   */
  getJobOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/offers`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }
  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/messages`);
  }
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/companies`);
  }

  // cambbiar estado de oferta (activar/desactivar)
  toggleOfferStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/offers/${id}/toggle`, {});
  }

  // mensajes
  // admin.service.ts
deleteMessage(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/admin/messages/${id}`, this.getHeaders());
}


}