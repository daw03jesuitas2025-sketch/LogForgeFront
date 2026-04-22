import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
      }
    });
  }

  // Método para el TFG: Acción de eliminar (solo lógica frontend por ahora)
  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      // Aquí llamarías a: this.adminService.deleteUser(id).subscribe(...)
      this.users = this.users.filter(u => u.id !== id);
      console.log('Usuario eliminado ID:', id);
    }
  }
}