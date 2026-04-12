import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experiences.component.html'
})
export class ExperiencesComponent {
  // Recibimos los trabajos desde el ProfileComponent
  @Input() jobs: any[] = [];

  // Avisamos al padre cuando hay acción
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
}