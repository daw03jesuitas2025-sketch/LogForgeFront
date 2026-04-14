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
      console.log('Login exitoso. Rol:', res.user.role);

      // --- PASO CRÍTICO: GUARDAR LOS DATOS ---
      // Guardamos el token para las cabeceras API
      localStorage.setItem('auth_token', res.token); 
      
      // Guardamos el rol para que el Nav sepa qué mostrar
      localStorage.setItem('role', res.user.role);
      
      // Guardamos el nombre para el avatar
      localStorage.setItem('userName', res.user.name);
      
      // Guardamos el objeto completo por si acaso
      localStorage.setItem('user_data', JSON.stringify(res.user));

      // --- REDIRECCIÓN ---
      const role = res.user.role;

      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']); 
      } 
      else if (role === 'company') {
        this.router.navigate(['/dashboard/company']); 
      } 
      else {
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