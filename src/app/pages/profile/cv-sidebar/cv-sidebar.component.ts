import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <h3 class="font-bold text-gray-700">Tu CV</h3>
      <div class="w-full bg-gray-100 h-2 rounded-full">
        <div class="bg-green-500 h-full rounded-full transition-all" 
             [style.width.%]="completionPercentage"></div>
      </div>
      <p class="text-xs text-gray-500">Fortaleza del perfil: {{ completionPercentage }}%</p>
      <button class="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
        Descargar CV (PDF)
      </button>
    </div>
  `
})
export class CvSidebarComponent {
  @Input() completionPercentage: number = 0; 
  @Input() cvPath: string = ''; }