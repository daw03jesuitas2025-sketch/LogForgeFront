import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experiences.component.html'
})
export class ExperiencesComponent {
  @Input() jobs: any[] = [];

  onDelete(job: any) {
    if (confirm('¿Estás seguro de que deseas eliminar esta experiencia laboral?')) {
      this.delete.emit(job);
    }
  }

  // Avisamos al padre cuando hay acción
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>(); 

}