import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class CompanyDashboardComponent implements OnInit {
  myOffers: any[] = [];
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedOfferId: number | null = null;

  // Definimos el objeto exactamente como lo espera Laravel
  newOffer = {
    title: '',
    description: '',
    location: '',
    is_active: true
  };

  private API_URL = 'http://127.0.0.1:8000/api/job-offers';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMyOffers();
  }

  loadMyOffers(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => this.myOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(job: any) {
    this.isEditing = true;
    this.selectedOfferId = job.id;
    // Aquí quitamos el companyName que daba error
    this.newOffer = {
      title: job.title,
      description: job.description,
      location: job.location,
      is_active: job.is_active
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    // Reseteamos solo los campos que existen en la definición
    this.newOffer = { 
      title: '', 
      description: '', 
      location: '', 
      is_active: true 
    };
    this.selectedOfferId = null;
  }

  createOffer() {
    this.http.post(this.API_URL, this.newOffer).subscribe({
      next: () => {
        this.loadMyOffers();
        this.closeModal();
      },
      error: () => alert('Error al crear la oferta')
    });
  }

  updateOffer() {
    if (this.selectedOfferId) {
      this.http.put(`${this.API_URL}/${this.selectedOfferId}`, this.newOffer).subscribe({
        next: () => {
          this.loadMyOffers();
          this.closeModal();
        },
        error: () => alert('Error al actualizar la oferta')
      });
    }
  }

  eliminarOferta(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta vacante?')) {
      this.http.delete(`${this.API_URL}/${id}`).subscribe(() => {
        this.myOffers = this.myOffers.filter(j => j.id !== id);
      });
    }
  }
}