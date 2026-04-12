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

  // Variables de control visual
  showPassword = false;

  // Modelo de datos para el formulario
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  role: 'user' | 'company' = 'user'; // Candidato por defecto

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    // 1. Validaciones básicas
    if (!this.name || !this.email || !this.password) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    if (this.password !== this.password_confirmation) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // 2. Ejecutar registro
    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      role: this.role
    }).subscribe({
      next: (res: any) => {
        console.log('Registro exitoso como:', this.role);
        
        // Redirigimos basándonos en el rol para que caigan en su layout correspondiente
        if (this.role === 'company') {
          this.router.navigate(['/dashboard/company']);
        } else {
          this.router.navigate(['/dashboard/landing']);
        }
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Hubo un problema al crear la cuenta. Revisa que el correo sea válido y no esté registrado.');
      }
    });
  }
}