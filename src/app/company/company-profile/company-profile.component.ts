import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  private API_URL = 'http://127.0.0.1:8000/api/company/my-profile';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get(this.API_URL).subscribe({
      next: (data: any) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }

  updateProfile() {
    // Usamos PUT para actualizar los datos en el servidor
    this.http.put(this.API_URL, this.profile).subscribe({
      next: () => {
        this.successMessage = '¡Perfil actualizado con éxito!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => alert('Error al actualizar el perfil')
    });
  }
}