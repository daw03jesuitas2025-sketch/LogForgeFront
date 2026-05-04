import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MessageService } from 'src/app/services/message.service'; 


@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-offers.component.html'
})
export class MyOffersComponent implements OnInit {
  appliedJobs: any[] = [];
  selectedApplications: any[] = [];
  selectedOfferTitle: string = '';
  showModal: boolean = false;
  loading: boolean = true;
  isEditing: boolean = false;
  selectedOfferId: number | null = null;
  
  showInterviewModal: boolean = false;
  selectedCandidate: any = null;
  interviewMessage: string = '';


  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers() {
    this.companyService.getMyOffers().subscribe({
      next: (data) => {
        this.appliedJobs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.loading = false;
      }
    });
  }

  verCandidatos(offerId: number, title: string) {
    this.selectedOfferTitle = title;
    // Llamamos al servicio para obtener los postulados
    this.companyService.getOfferApplications(offerId).subscribe({
      next: (data) => {
        this.selectedApplications = data;
        this.showModal = true;
      },
      error: (err) => console.error('Error al cargar candidatos:', err)
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.selectedApplications = [];
  }
  openInterviewModal(candidate: any) {
    this.selectedCandidate = candidate;
    this.interviewMessage = `Hola ${candidate.name}, nos ha gustado tu perfil para la oferta "${this.selectedOfferTitle}" y queremos agendar una entrevista contigo.`;
    this.showInterviewModal = true;
  }

  confirmInterview() {
    if (!this.selectedCandidate) return;
    console.log('Enviando a:', this.selectedCandidate.id, 'Mensaje:', this.interviewMessage);
    
    // Simulación de éxito
    alert('¡Invitación enviada con éxito!');
    this.showInterviewModal = false;
    this.interviewMessage = '';
  }
}