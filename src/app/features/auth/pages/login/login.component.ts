import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  showPassword: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.auth.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        // Si el login es correcto, te manda al landing
        this.router.navigate(['/landing']);
      },
      error: (err) => {
        console.error('Error login:', err);
        alert('Credenciales incorrectas o error de servidor');
      }
    });
  }
}
