import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

interface AdminMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  from_name: string;
  from_email: string;
  to_name: string;
  subject: string;
  message: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
})
export class AdminComponent implements OnInit, OnDestroy {

  users: any[] = [];
  messages: AdminMessage[] = [];
  lastUpdate: Date = new Date();
  selectedMessage: AdminMessage | null = null; // Para el modal

  stats = {
    totalUsers: 0,
    activeOffers: 0,
    reportedMessages: 0
  };

  private statsInterval: any;

  constructor(private adminService: AdminService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loadDashboardData();
    this.statsInterval = setInterval(() => {
      this.refreshStats();
    }, 60000); // Refresca cada 60 segundos
  }

  ngOnDestroy() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
  }

  // Esta es la clave: detecta si estamos en la raíz del admin o en una sub-sección
  isRootAdmin(): boolean {
    return this.router.url === '/admin' || this.router.url === '/admin/dashboard';
  }

  loadDashboardData() {
    this.refreshStats();
    this.loadMessages();
  }

  loadMessages() {
    this.adminService.getMessages().subscribe({
      next: (data: any[]) => {
        this.messages = data.map(msg => ({
          ...msg,
          initials: msg.from_name ? msg.from_name.charAt(0).toUpperCase() : '?',
          priority: msg.subject.includes('entrevista') ? 'Media' : 'Alta'
        }));
      },
      error: (err) => console.error('Error al cargar mensajes:', err)
    });
  }

  refreshStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.lastUpdate = new Date();
      },
      error: (err) => console.error('Error al refrescar stats:', err)
    });
  }

  onLogout() {
    // Llamamos al servicio
    this.authService.logout().subscribe({
      next: () => {
        // Cuando el servidor responde OK
        console.log('Sesión cerrada en el servidor');
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Si el servidor da error (ej. token caducado), 
        // igual redirigimos porque finalize() ya limpió el localStorage
        console.warn('Error al cerrar sesión, pero saliendo igualmente...', err);
        this.router.navigate(['/']);
      }
    });
  }
  viewMessageDetail(id: number) {
    // Buscamos el mensaje en nuestro array local
    this.selectedMessage = this.messages.find(m => m.id === id) || null;
  }

  closeModal() {
    this.selectedMessage = null;
  }

  deleteMessage(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      this.adminService.deleteMessage(id).subscribe({
        next: () => {
          // Filtramos el array para quitar el mensaje borrado de la vista
          this.messages = this.messages.filter(m => m.id !== id);
          this.selectedMessage = null;
          this.refreshStats(); // Actualizamos el contador de mensajes
          alert('Mensaje eliminado correctamente');
        },
        error: (err: any) => console.error('Error al eliminar:', err)
      });
    }
  }
}