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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/job-offers').subscribe({
      next: (data) => this.jobOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });
  }

  eliminarOferta(id: number) {
    if(confirm('¿Borrar oferta?')) {
      this.http.delete(`http://127.0.0.1:8000/api/job-offers/${id}`).subscribe(() => {
        this.jobOffers = this.jobOffers.filter(j => j.id !== id);
      });
    }
  }
}