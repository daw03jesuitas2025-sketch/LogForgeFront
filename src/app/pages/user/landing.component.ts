import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@services/message.service';
import { environment } from '../../../environments/environment';

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
  messages: any[] = [];

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private API_BASE = `https://${environment.apiUrl}/api`;

  ngOnInit(): void {
    this.http.get<any[]>(`${this.API_BASE}/job-offers`).subscribe({
      next: (data) => this.jobOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });

    // 2. Cargar datos privados del usuario
    this.loadMyApplications();
    this.loadCurrentUser();
    this.loadSuggestions();
    this.loadMessages();
  }

  // Helper para obtener headers rápidamente
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  loadCurrentUser() {
    this.http.get<any>(`${this.API_BASE}/me`, this.getHeaders()).subscribe({
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
    this.http.get<any[]>(`${this.API_BASE}/suggestions`, this.getHeaders()).subscribe({
      next: (data) => this.suggestions = data,
      error: (err) => console.error('Error Suggestions:', err)
    });
  }

  loadMyApplications() {
    this.http.get<any[]>(`${this.API_BASE}/my-applications`, this.getHeaders()).subscribe({
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

    this.http.post(`${this.API_BASE}/applications`, payload, this.getHeaders()).subscribe({
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
      this.http.delete(`${this.API_BASE}/job-offers/${id}`, this.getHeaders())
        .subscribe({
          next: () => {
            this.jobOffers = this.jobOffers.filter(j => j.id !== id);
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
          }
        });
    }
  }

  loadMessages() {
    this.messageService.getMyMessages().subscribe({
      next: (data) => {
        this.messages = data;
        console.log('Mis mensajes:', data);
      },
      error: (err) => console.error('Error cargando mensajes:', err)
    });
  }
}