import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@services/message.service';
import { CompanyService } from '@services/company.service';
import { environment } from 'src/environments/environment'; // mirar si es este o prod

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class CompanyDashboardComponent implements OnInit {
  // Datos de la interfaz
  myOffers: any[] = [];
  candidates: any[] = [];
  companyProfile: any = null;
  
  // Estados de Modales
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedOfferId: number | null = null;
  
  showInterviewModal: boolean = false;
  selectedCandidate: any = null;
  interviewMessage: string = '';

  // Modelo para nueva oferta
  newOffer = {
    title: '',
    description: '',
    location: '',
    is_active: true
  };

  private API_BASE = `https://${environment.apiUrl}/api/company`;

  constructor(
    private http: HttpClient, 
    private messageService: MessageService, 
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.refreshDashboard();
  }

  /**
   * Refresca todos los datos del dashboard
   */
  refreshDashboard(): void {
    this.loadMyOffers();
    this.loadCandidates(); 
    this.loadCompanyProfile();
  }

  /**
   * Genera los headers con el token Bearer para Laravel Sanctum
   */
  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- CARGA DE DATOS ---

  loadMyOffers(): void {
    this.http.get<any[]>(`${this.API_BASE}/my-offers`, { headers: this.getHeaders() }).subscribe({
      next: (data) => this.myOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });
  }

  loadCandidates(): void {
    this.http.get<any[]>(`${this.API_BASE}/candidates`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        console.log('Candidatos cargados con éxito');
        this.candidates = data;
      },
      error: (err) => console.error('Error cargando candidatos:', err)
    });
  }

  loadCompanyProfile(): void {
    // Usamos el servicio que ya maneja la lógica de perfil
    this.companyService.getMyProfile().subscribe({
      next: (data) => this.companyProfile = data,
      error: (err) => console.error('Error cargando perfil:', err)
    });
  }

  // --- GESTIÓN DE OFERTAS ---

  createOffer() {
    this.http.post(`${this.API_BASE}/job-offers`, this.newOffer, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.loadMyOffers();
        this.closeModal();
      },
      error: () => alert('Error al crear la oferta')
    });
  }

  updateOffer() {
    if (this.selectedOfferId) {
      this.http.put(`${this.API_BASE}/job-offers/${this.selectedOfferId}`, this.newOffer, { headers: this.getHeaders() }).subscribe({
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
      this.http.delete(`${this.API_BASE}/job-offers/${id}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.myOffers = this.myOffers.filter(j => j.id !== id);
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  // --- GESTIÓN DE MODALES ---

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
    this.newOffer = { title: '', description: '', location: '', is_active: true };
    this.selectedOfferId = null;
  }

  // --- GESTIÓN DE ENTREVISTAS ---

  openInterviewModal(candidate: any) {
    this.selectedCandidate = candidate;
    this.interviewMessage = `Hola ${candidate.name}, nos ha gustado tu perfil y queremos agendar una entrevista contigo.`;
    this.showInterviewModal = true;
  }

  confirmInterview() {
    if (!this.selectedCandidate) return;

    this.messageService.sendInterviewRequest(this.selectedCandidate.id, this.interviewMessage)
      .subscribe({
        next: () => {
          alert('¡Invitación enviada con éxito!');
          this.showInterviewModal = false;
        },
        error: (err) => {
          console.error('Error enviando mensaje:', err);
          alert('Hubo un problema al enviar la invitación.');
        }
      });
  }
}