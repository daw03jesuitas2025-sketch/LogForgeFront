import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@services/message.service';
import { CompanyService } from '@services/company.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class CompanyDashboardComponent implements OnInit {
  myOffers: any[] = [];
  candidates: any[] = [];
  companyProfile: any = null;
  
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedOfferId: number | null = null;
  
  showInterviewModal: boolean = false;
  selectedCandidate: any = null;
  interviewMessage: string = '';

  newOffer = {
    title: '',
    description: '',
    location: '',
    is_active: true
  };

  // URLs unificadas con el prefijo 'company' definido en Laravel
  private API_BASE = 'http://127.0.0.1:8000/api/company';

  constructor(
    private http: HttpClient, 
    private messageService: MessageService, 
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadMyOffers();
    this.loadCandidates(); 
    this.loadCompanyProfile();
  }

  loadMyOffers(): void {
    this.http.get<any[]>(`${this.API_BASE}/my-offers`).subscribe({
      next: (data) => this.myOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });
  }

  loadCandidates(): void {
    this.http.get<any[]>(`${this.API_BASE}/candidates`).subscribe({
      next: (data) => this.candidates = data,
      error: (err) => console.error('Error cargando candidatos:', err)
    });
  }

  loadCompanyProfile(): void {
    this.companyService.getMyProfile().subscribe({
      next: (data) => this.companyProfile = data,
      error: (err) => console.error('Error cargando perfil:', err)
    });
  }

  createOffer() {
    this.http.post(`${this.API_BASE}/job-offers`, this.newOffer).subscribe({
      next: () => {
        this.loadMyOffers();
        this.closeModal();
      },
      error: () => alert('Error al crear la oferta')
    });
  }

  updateOffer() {
    if (this.selectedOfferId) {
      this.http.put(`${this.API_BASE}/job-offers/${this.selectedOfferId}`, this.newOffer).subscribe({
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
      this.http.delete(`${this.API_BASE}/job-offers/${id}`).subscribe({
        next: () => {
          this.myOffers = this.myOffers.filter(j => j.id !== id);
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  // MODALES
  openCreateModal() {
    this.isEditing = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(job: any) {
    this.isEditing = true;
    this.selectedOfferId = job.id;
    this.newOffer = { ...job };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.newOffer = { title: '', description: '', location: '', is_active: true };
    this.selectedOfferId = null;
  }

  openInterviewModal(candidate: any) {
    this.selectedCandidate = candidate;
    this.interviewMessage = `Hola ${candidate.name}, nos ha gustado tu perfil y queremos agendar una entrevista contigo.`;
    this.showInterviewModal = true;
  }

  confirmInterview() {
    this.messageService.sendInterviewRequest(this.selectedCandidate.id, this.interviewMessage)
      .subscribe(() => {
        alert('¡Invitación enviada!');
        this.showInterviewModal = false;
      });
  }
}