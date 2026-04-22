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
  [x: string]: any;
  myOffers: any[] = [];
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedOfferId: number | null = null;
  candidates: any[] = [];
  companyProfile: any = null;


  newOffer = {
    title: '',
    description: '',
    location: '',
    is_active: true
  };

  private API_URL = 'http://127.0.0.1:8000/api/job-offers';
  

  constructor(private http: HttpClient, private messageService: MessageService, private companyService: CompanyService) {}

ngOnInit(): void {
  this.loadMyOffers();
  this.loadCandidates(); 
  this.loadCompanyProfile();
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
showInterviewModal = false;
selectedCandidate: any = null;
interviewMessage: string = '';

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

loadCandidates(): void {
  this.http.get<any[]>('http://127.0.0.1:8000/api/candidates').subscribe({
    next: (data) => this.candidates = data,
    error: (err) => console.error('Error cargando candidatos:', err)
  });
}
loadCompanyProfile() {
    // Aquí debes llamar a un endpoint que devuelva el perfil del usuario autenticado
    this.companyService.getMyProfile().subscribe({
      next: (data) => {
        this.companyProfile = data;
      },
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }
}