import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
@Component({
  selector: 'app-cv-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-sidebar.component.html'
})
export class CvSidebarComponent {
  @Input() completionPercentage: number = 0;

  constructor(private profileService: ProfileService) {}

  downloadResume() {
    this.profileService.downloadResume().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mi_curriculum_logforge.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        console.error('Error descargando CV:', err);
        alert('No se pudo generar el PDF. Revisa que tu perfil tenga datos.');
      }
    });
  }
}