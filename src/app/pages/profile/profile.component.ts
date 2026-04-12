import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ExperiencesComponent } from './experiences/experiences.component';
import { EducationsComponent } from './educations/educations.component';
import { SkillsComponent } from './skills/skills.component';
import { CvSidebarComponent } from './cv-sidebar/cv-sidebar.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ExperiencesComponent, 
    EducationsComponent, 
    SkillsComponent, 
    CvSidebarComponent, 
    EditModalComponent 
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  isModalOpen = false;
  modalTitle = '';
  selectedData: any = null;
  
  // Variables para los datos de las secciones
  jobs: any[] = [];
  educations: any[] = [];
  skills: string[] = [];

  // Controlamos qué sección estamos editando para saber qué servicio llamar
  currentType: 'experience' | 'education' = 'experience';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
    //this.loadSkills();
  }

// Carga el perfil completo (incluye experiencias y educaciones si Laravel las envía)
loadProfile() {
  this.profileService.show().subscribe({
    next: (res: any) => {
      this.profileData = res;
      this.educations = res.educations || [];
      this.jobs = res.experiences || [];
      this.skills = res.skills || [];
    },
    error: (err: any) => {
      console.error('Error al cargar perfil:', err);
    }
  });
}

  loadSkills() {
    this.profileService.getSkills().subscribe({
      next: (data) => {
        this.skills = data;
      },
      error: (err) => console.error('Error al cargar skills:', err)
    });
  }

  // Se activa al pulsar el botón "+" en cualquier sección
  handleAdd(type: 'experience' | 'education') {
    this.currentType = type;
    this.selectedData = null;
    this.modalTitle = type === 'experience' ? 'Añadir Experiencia' : 'Añadir Formación Académica';
    this.isModalOpen = true;
  }

  // Se activa al pulsar "Editar" en una tarjeta específica
  handleEdit(data: any, type: 'experience' | 'education') {
    this.currentType = type;
    this.selectedData = data;
    this.modalTitle = type === 'experience' ? 'Editar Experiencia' : 'Editar Formación Académica';
    this.isModalOpen = true;
  }

  // Recibe los datos del modal y decide qué método del servicio usar
  saveChanges(formData: any) {
    let request;

    if (this.currentType === 'experience') {
      request = (this.selectedData && this.selectedData.id)
        ? this.profileService.updateExperience(this.selectedData.id, formData)
        : this.profileService.addExperience(formData);
    } else {
      request = (this.selectedData && this.selectedData.id)
        ? this.profileService.updateEducation(this.selectedData.id, formData)
        : this.profileService.addEducation(formData);
    }

    request.subscribe({
      next: () => {
        this.isModalOpen = false;
        this.loadProfile(); // Refresca los datos tras guardar
      },
      error: (err) => console.error('Error al guardar:', err)
    });
  }
}