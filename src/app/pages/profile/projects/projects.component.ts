import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styles: []
})
export class ProjectsComponent {
  // Recibimos la lista de proyectos desde el ProfileComponent
  @Input() projects: any[] = [];

  // Definimos los eventos para comunicar acciones al padre
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor() {}
  
  onDelete(project: any) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      this.delete.emit(project);
    }
  }
}