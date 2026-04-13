import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  jobOffers: any[] = [];
  appliedJobs: any[] = [];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/job-offers').subscribe({
      next: (data) => this.jobOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });
    this.loadMyApplications();

  }

  postularse(jobId: number) {
    console.log('Intentando postularse a la oferta ID:', jobId);

    const payload = {
      job_offer_id: jobId,
      message: 'Hola, me interesa esta vacante.'
    };

    this.http.post('http://127.0.0.1:8000/api/applications', payload).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('¡Postulación enviada!');
      },
      error: (err) => {
        console.error('Error al enviar postulación:', err);
        alert('Error: ' + (err.error.message || 'No se pudo enviar'));
      }
    });
  }

loadMyApplications() {
  this.http.get<any[]>('http://127.0.0.1:8000/api/my-applications').subscribe({
    next: (data) => {
      this.appliedJobs = data;
      console.log('Mis postulaciones:', data);
    },
    error: (err) => console.error(err)
  });
}

  eliminarOferta(id: number) {
    if (confirm('¿Borrar oferta?')) {
      this.http.delete(`http://127.0.0.1:8000/api/job-offers/${id}`).subscribe(() => {
        this.jobOffers = this.jobOffers.filter(j => j.id !== id);
      });
    }
  }
}