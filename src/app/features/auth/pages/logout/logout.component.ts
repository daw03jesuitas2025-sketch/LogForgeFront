import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: '<p>Cerrando sesión...</p>'
})
export class LogoutComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}