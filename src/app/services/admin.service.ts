import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Definimos una única base para evitar confusiones
  private API = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene las estadísticas numéricas (Total usuarios, ofertas, etc.)
   * URL final: http://localhost:8000/api/admin/stats
   */
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.API}/admin/stats`);
  }

  /**
   * Obtiene la lista de usuarios para la tabla
   * URL final: http://localhost:8000/api/admin/users
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/admin/users`);
  }

  /**
   * Obtiene la lista de ofertas de trabajo
   * URL final: http://localhost:8000/api/admin/offers
   */
  getJobOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/admin/offers`);
  }

  /**
   * Este método es el que usabas en el login o dashboard.
   * Lo unificamos para que use la misma estructura.
   */
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.API}/admin/stats`);
  }
}