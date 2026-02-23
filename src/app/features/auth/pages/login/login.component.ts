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
    const credentials = {
      email: this.email.trim(),
      password: this.password,
    };

    this.auth.login(credentials).subscribe({
      next: (res: any) => {
        console.log('Login exitoso, redirigiendo...');
        
        // Redirigimos a la ruta hija del layout privado
        this.router.navigate(['/dashboard/landing']);
      },
      error: (err) => {
        console.error('Error login:', err);
        // Si el error es de CORS, recuerda lo que hablamos del .env en Laravel
        alert('Credenciales incorrectas o error de servidor');
      }
    });
  }
}