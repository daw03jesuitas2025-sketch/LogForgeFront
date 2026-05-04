import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidates-list.component.html'
})
export class CandidatesListComponent implements OnInit {
  candidates: any[] = [];
  loading: boolean = true;
  showEditModal = false;
  editingCandidate: any = {};

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  loadCandidates() {
    this.loading = true;
    // Asumiendo que crearás este método en tu AdminService
    this.adminService.getCandidates().subscribe({
      next: (data) => {
        this.candidates = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar candidatos:', err);
        this.loading = false;
      }
    });
  }

  editCandidate(candidate: any) {
    // Clonamos el objeto para no modificar la tabla antes de guardar
    this.editingCandidate = { ...candidate };
    this.showEditModal = true;
  }

  saveCandidateChanges() {
    // Usamos el user_id para identificar el perfil en la API
    const id = this.editingCandidate.user_id || this.editingCandidate.id;
    
    this.adminService.updateCandidateProfile(id, this.editingCandidate).subscribe({
      next: () => {
        this.showEditModal = false;
        this.loadCandidates(); 
        alert('Perfil del candidato actualizado con éxito');
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al actualizar el perfil');
      }
    });
  }
}