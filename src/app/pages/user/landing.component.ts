import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  jobOffers: any[] = [];
  appliedJobs: any[] = [];
  currentUser: any = null;
  suggestions: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // 1. Cargar ofertas globales
    this.http.get<any[]>('http://127.0.0.1:8000/api/job-offers').subscribe({
      next: (data) => this.jobOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });

    // 2. Cargar datos privados del usuario
    this.loadMyApplications();
    this.loadCurrentUser();
    this.loadSuggestions();
  }

  // Helper para obtener headers rápidamente
  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  loadCurrentUser() {
    this.http.get<any>('http://127.0.0.1:8000/api/me', this.getHeaders()).subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.log('Error User:', err)
    });
  }
  // Crea este método para obtener las ofertas filtradas
 get filteredJobOffers() {
  if (!this.jobOffers) return [];
  return this.jobOffers.filter(job =>
    job.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

  loadSuggestions() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/suggestions', this.getHeaders()).subscribe({
      next: (data) => this.suggestions = data,
      error: (err) => console.error('Error Suggestions:', err)
    });
  }

  loadMyApplications() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/my-applications', this.getHeaders()).subscribe({
      next: (data) => {
        this.appliedJobs = data;
        console.log('Mis postulaciones:', data);
      },
      error: (err) => console.error('Error MyApps:', err)
    });
  }

  postularse(jobId: number) {
    const payload = {
      job_offer_id: jobId,
      message: 'Hola, me interesa esta vacante.'
    };

    // AÑADIDO: getHeaders() para que Laravel sepa quién se postula
    this.http.post('http://127.0.0.1:8000/api/applications', payload, this.getHeaders()).subscribe({
      next: (res) => {
        alert('¡Postulación enviada con éxito!');
        this.loadMyApplications(); // Recarga la lista lateral automáticamente
      },
      error: (err) => {
        alert('Error: ' + (err.error.message || 'No se pudo enviar'));
      }
    });
  }

  hasApplied(jobId: number): boolean {
    return this.appliedJobs.some(app => app.job_offer_id === jobId);
  }

  eliminarOferta(id: number) {
    if (confirm('¿Borrar oferta?')) {
      this.http.delete(`http://127.0.0.1:8000/api/job-offers/${id}`, this.getHeaders()).subscribe(() => {
        this.jobOffers = this.jobOffers.filter(j => j.id !== id);
      });
    }
  }
}