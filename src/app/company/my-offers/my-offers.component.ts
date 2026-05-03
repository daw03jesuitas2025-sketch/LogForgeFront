import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { UserService } from 'src/app/services/user.service'; 

@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-offers.component.html'
})
export class MyOffersComponent implements OnInit {
  appliedJobs: any[] = [];
  selectedApplications: any[] = [];
  selectedOfferTitle: string = '';
  showModal: boolean = false;
  loading: boolean = true;

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
}