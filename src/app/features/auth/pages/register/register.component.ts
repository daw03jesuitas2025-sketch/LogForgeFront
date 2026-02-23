import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  showPassword = false;

  name = '';
  email = '';
  password = '';
  password_confirmation = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    }).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => console.error(err),
    });
  }
}
