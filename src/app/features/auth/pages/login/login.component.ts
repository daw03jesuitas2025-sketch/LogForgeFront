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
        console.log('Login exitoso:', res.user.role);
        
        // Lógica de redirección por ROL
        const role = res.user.role;

        if (role === 'admin') {
          // Te lleva al panel que diseñamos antes
          this.router.navigate(['/admin/dashboard']); 
        } 
        else if (role === 'company') {
          // Aquí pones la ruta que crees para empresas
          this.router.navigate(['/dashboard/company']); 
        } 
        else {
          // El 'user' normal va a tu layout actual
          this.router.navigate(['/dashboard/landing']);
        }
      },
      error: (err) => {
        console.error('Error login:', err);
        alert('Credenciales incorrectas o error de servidor');
      }
    });
  }
}