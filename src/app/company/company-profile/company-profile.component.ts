import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Añadido HttpHeaders
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-profile.component.html'
})
export class CompanyProfileComponent implements OnInit {
  profile: any = {
    company_name: '',
    website: '',
    description: ''
  };
  
  loading: boolean = true;
  successMessage: string = '';

  // Usamos la variable de environment para ser consistentes
  private API_URL = `${environment.apiUrl}/company/my-profile`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // Función auxiliar para obtener los headers con el token
  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadProfile() {
    this.http.get(this.API_URL, { headers: this.getHeaders() }).subscribe({
      next: (data: any) => {
        // Si el backend devuelve el perfil (aunque sea vacío), lo asignamos
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.loading = false;
      }
    });
  }

  updateProfile() {
    this.http.put(this.API_URL, this.profile, { headers: this.getHeaders() }).subscribe({
      next: (response: any) => {
        this.successMessage = '¡Perfil actualizado con éxito!';
        this.profile = response; // Actualizamos con lo que devuelve el servidor
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error en update:', err);
        alert('Error al actualizar el perfil');
      }
    });
  }
}