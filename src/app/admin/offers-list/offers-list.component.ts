import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-job-offers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers-list.component.html'
})
export class JobOffersListComponent implements OnInit {
  offers: any[] = [];
  loading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers() {
    this.adminService.getJobOffers().subscribe({
      next: (data) => {
        this.offers = data;
        this.loading = false;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  toggleStatus(offer: any) {
    this.adminService.toggleOfferStatus(offer.id).subscribe({
      next: (res) => {
        offer.is_active = res.is_active; // Actualizamos la UI sin recargar
      }
    });
  }

  deleteOffer(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar esta oferta permanentemente?')) {
    this.adminService.deleteUser(id).subscribe({ // Usaremos el método de borrar genérico del admin
      next: () => {
        // Filtramos la lista para quitar la oferta eliminada
        this.offers = this.offers.filter(o => o.id !== id);
        alert('Oferta eliminada correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar oferta:', err);
        alert('No se pudo eliminar la oferta.');
      }
    });
  }
}
}