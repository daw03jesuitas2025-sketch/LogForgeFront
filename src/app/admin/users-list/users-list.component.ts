import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  isEditing: boolean = false;
  selectedUserId: number | null = null;
  
  // Lógica del Modal
  showModal: boolean = false;
  userForm: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    // inicializar el formulario para crear un nuevo usuario
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['candidate', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
      }
    });
  }

  // Funciones para el Modal
 openModal(user: any = null) {
    if (user) {
      // MODO EDICIÓN
      this.isEditing = true;
      this.selectedUserId = user.id;
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '' // La dejamos vacía al editar
      });
      // Al editar, el password no debería ser obligatorio
      this.userForm.get('password')?.clearValidators();
    } else {
      // MODO CREACIÓN
      this.isEditing = false;
      this.selectedUserId = null;
      this.userForm.reset({ role: 'candidate' });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

 // En users-list.component.ts

saveUser() {
  if (this.userForm.invalid) return;

  const userData = this.userForm.value;
  
  // Si estamos editando y el password está vacío, lo eliminamos del objeto 
  // para que Laravel no intente validar una cadena vacía o cambiarla.
  if (this.isEditing && !userData.password) {
    delete userData.password;
  }

  if (this.isEditing && this.selectedUserId) {
    this.adminService.updateUser(this.selectedUserId, userData).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
        alert('Usuario actualizado con éxito');
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  } else {
    this.adminService.createUser(userData).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
        alert('Usuario creado con éxito');
      },
      error: (err) => console.error('Error al crear:', err)
    });
  }
}

  closeModal() { 
    this.showModal = false;
    this.userForm.reset({ role: 'candidate' });
  }

  createUser() {
    if (this.userForm.valid) {
      console.log('Enviando datos al backend:', this.userForm.value);
      // Aquí llamarías a tu servicio:
      // this.adminService.createUser(this.userForm.value).subscribe({ ... });
      
      // Simulación para el frontend:
      const newUser = { 
        id: Date.now(), 
        ...this.userForm.value, 
        created_at: new Date().toISOString() 
      };
      this.users.unshift(newUser); // Lo ponemos el primero de la lista
      this.closeModal();
    }
  }

deleteUser(id: number): void {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: (err) => alert('No se pudo eliminar el usuario.')
    });
  }
}
}