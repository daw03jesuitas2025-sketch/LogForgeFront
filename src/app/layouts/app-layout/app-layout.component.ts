import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  isMenuOpen = false;
  userInitial: string = 'U'; // 'U' por defecto si falla algo
  userName: string = 'Usuario';

  constructor(private auth: AuthService, private router: Router) {
    const name = localStorage.getItem('userName');
    if (name) {
      this.userName = name;
      this.userInitial = name.charAt(0).toUpperCase();
    }
  }

  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }

  onLogout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}