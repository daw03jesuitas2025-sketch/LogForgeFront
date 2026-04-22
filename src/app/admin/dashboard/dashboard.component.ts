import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { AdminService } from '../../services/admin.service'; 
import { CommonModule } from '@angular/common'; 

/**
 * Interfaz para definir la estructura de los mensajes
 * Esto ayuda a evitar errores de tipado y facilita el uso de @for en el HTML
 */
interface AdminMessage {
  id: number;
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  created_at: string;
  priority: 'Baja' | 'Media' | 'Alta';
  initials: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AdminComponent implements OnInit, OnDestroy {
  
  // Listas de datos
  users: any[] = [];
  jobOffers: any[] = [];
  messages: AdminMessage[] = []; // Nueva lista para la tabla de mensajes
  
  // Estadísticas del dashboard
  stats = {
    totalUsers: 0,
    activeOffers: 0,
    reportedMessages: 0
  };

  // Variable para el control del intervalo de actualización
  private statsInterval: any;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();

    // Actualización dinámica de estadísticas cada 10 segundos
    this.statsInterval = setInterval(() => {
      this.refreshStats();
    }, 10000); 
  }

  /**
   * Limpieza al destruir el componente para evitar fugas de memoria
   */
  ngOnDestroy() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }

  /**
   * Carga inicial de todos los datos necesarios para el dashboard
   */
  loadDashboardData() {
    this.refreshStats();

    // Cargar la lista de usuarios (por si la necesitas en otra vista)
    this.adminService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });

    // Cargar los mensajes que ahora se muestran en la tabla principal
    this.loadMessages();
  }

  /**
   * Carga los mensajes de soporte/reportes desde el servicio
   */
  loadMessages() {
    // Si tu servicio aún no tiene getMessages, devolverá un array vacío o error
    this.adminService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
        // Datos de ejemplo por si el servicio falla o no está implementado aún
        this.messages = []; 
      }
    });
  }

  /**
   * Actualiza únicamente los contadores superiores
   */
  refreshStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Estadísticas actualizadas:', data);
      },
      error: (err) => console.error('Error al refrescar stats:', err)
    });
  }

  /**
   * Lógica para ver el detalle de un mensaje de la tabla
   */
  viewMessageDetail(id: number) {
    console.log('Abriendo detalle del mensaje ID:', id);
    // Aquí podrías redirigir a una vista de detalle o abrir un modal
  }

  toggleOfferStatus(id: number) {
    console.log('Cambiando estado de oferta:', id);
  }

  verifyUser(id: number) {
    console.log('Verificando usuario:', id);
  }
}