import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shared-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shared-nav.component.html',
  styleUrls: ['./shared-nav.component.css']
})
export class SharedNavComponent implements OnInit {

  isMenuOpen = false;
  userInitial: string = 'U';
  userName: string = 'Usuario';
  userRole: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

loadUser() {
  // 1. Carga inicial desde LocalStorage para evitar el parpadeo de la interfaz
  const savedRole = localStorage.getItem('userRole');
  const savedName = localStorage.getItem('userName');
  const token = localStorage.getItem('token'); 

  if (savedRole) {
    this.userRole = savedRole.toLowerCase().trim();
  }
  if (savedName) {
    this.userName = savedName;
    this.userInitial = savedName.charAt(0).toUpperCase();
  }

  // 2. Si hay token, consultamos al servidor para asegurar que los datos son reales
  if (token) {
    this.http.get<any>(`https://${environment.apiUrl}/api/me`).subscribe({
      next: (user: any) => {
        if (user?.role) {
          this.userRole = user.role.toLowerCase().trim();
          localStorage.setItem('userRole', this.userRole); // Actualizamos por si cambió
        }
        if (user?.name) {
          this.userName = user.name;
          this.userInitial = user.name.charAt(0).toUpperCase();
          localStorage.setItem('userName', user.name);
        }
      },
      error: (err: any) => {
        console.error('Error cargando usuario en nav:', err);
        // Si el token es inválido (401), el interceptor limpiará el storage y redirigirá
      }
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

// 1. Ruta de Inicio
get homeRoute(): string {
  // Empresa -> Su dashboard con métricas
  // Alumno -> Su listado de ofertas disponibles para postular
  return this.userRole === 'company' ? '/dashboard/company' : '/dashboard/landing';
}

// 2. Ruta de "Mis Ofertas"
get offersRoute(): string {
  // Empresa -> Las ofertas que ella ha publicado (para ver candidatos)
  // Alumno -> Las ofertas en las que él está participando (sus aplicaciones)
  return this.userRole === 'company' ? '/dashboard/my-offers' : '/dashboard/my-applications';
}

// 3. Ruta de Perfil
get profileRoute(): string {
  // Empresa -> Formulario con nombre de empresa, CIF, web...
  // Alumno -> Formulario con nombre, apellidos, CV...
  return this.userRole === 'company' ? '/dashboard/company-profile' : '/dashboard/profile';
}

}