import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Añadido NavigationEnd
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators'; // Añadido filter

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent implements OnInit {

  isMenuOpen = false;
  userInitial: string = 'U';
  userName: string = 'Usuario';
  userRole: string = 'user';

  constructor(
    private auth: AuthService, 
    private router: Router,
    private http: HttpClient 
  ) { 
    // TRUCO FINAL: Cada vez que la URL cambie, refrescamos el rol
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserRole();
    });
  }

  ngOnInit(): void {
    this.loadUserRole();
  }

  loadUserRole() {
    // 1. Intentamos leer de LocalStorage (rápido)
    const savedRole = localStorage.getItem('role');
    const savedName = localStorage.getItem('userName');
    
    if (savedRole) {
      this.userRole = savedRole.toLowerCase().trim();
    }
    if (savedName) {
      this.userName = savedName;
      this.userInitial = savedName.charAt(0).toUpperCase();
    }

    // 2. Verificación de respaldo con la API (seguro)
    const token = localStorage.getItem('auth_token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.get<any>('http://127.0.0.1:8000/api/me', { headers }).subscribe({
        next: (user: any) => {
          this.userRole = user.role.toLowerCase().trim();
          this.userName = user.name;
          this.userInitial = user.name.charAt(0).toUpperCase();
          console.log('Nav actualizado. Rol real:', this.userRole);
        },
        error: (err: any) => console.error('Error en Nav:', err)
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}