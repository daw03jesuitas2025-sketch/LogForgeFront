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
  userRole: string = 'user';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');

    if (savedRole) {
      this.userRole = savedRole.toLowerCase().trim();
    }
    if (savedName) {
      this.userName = savedName;
      this.userInitial = savedName.charAt(0).toUpperCase();
    }

    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.get<any>(`${environment.apiUrl}/me`, { headers }).subscribe({
        next: (user: any) => {
          if (user?.role) this.userRole = user.role.toLowerCase().trim();
          if (user?.name) {
            this.userName = user.name;
            this.userInitial = user.name.charAt(0).toUpperCase();
          }
        },
        error: (err: any) => console.error('Error cargando usuario en nav:', err)
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
get homeRoute(): string {
  return this.userRole === 'company' ? '/dashboard/company' : '/dashboard/landing';
}

get profileRoute(): string {
  return this.userRole === 'company' ? '/dashboard/company-profile' : '/dashboard/profile';
}

}