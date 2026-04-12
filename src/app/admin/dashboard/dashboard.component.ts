import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { AdminService } from '../../services/admin.service'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
})
export class AdminComponent implements OnInit, OnDestroy { // Implementamos OnDestroy
  
  users: any[] = [];
  jobOffers: any[] = [];
  stats = {
    totalUsers: 0,
    activeOffers: 0,
    reportedMessages: 0
  };

  // Variable para guardar el intervalo y poder limpiarlo
  private statsInterval: any;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();

    // HACEMOS QUE EL CONTADOR SEA DINÁMICO: 
    // Cada 10 segundos pide las estadísticas al servidor
    this.statsInterval = setInterval(() => {
      this.refreshStats();
    }, 10000); 
  }

  // Se ejecuta cuando sales de la página (para no gastar datos/memoria)
  ngOnDestroy() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }

  loadDashboardData() {
    // Primera carga de todo
    this.refreshStats();

    // Cargar usuarios (la lista de la tabla)
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
    });

    // Cargar ofertas
    this.adminService.getJobOffers().subscribe(data => {
      this.jobOffers = data;
    });
  }

  // Función específica para actualizar solo los números (más ligera)
  refreshStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Estadísticas actualizadas:', data.totalUsers);
      },
      error: (err) => console.error('Error al refrescar stats:', err)
    });
  }

  // --- Tus funciones de botones ---
  toggleOfferStatus(id: number) {
    console.log('Cambiando estado de oferta:', id);
  }

  verifyUser(id: number) {
    console.log('Verificando usuario:', id);
  }
}