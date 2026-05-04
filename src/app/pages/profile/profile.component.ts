import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ExperiencesComponent } from './experiences/experiences.component';
import { EducationsComponent } from './educations/educations.component';
import { SkillsComponent } from './skills/skills.component';
import { CvSidebarComponent } from './cv-sidebar/cv-sidebar.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { Observable } from 'rxjs';
import { ProjectsComponent } from './projects/projects.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ExperiencesComponent, EducationsComponent, SkillsComponent, CvSidebarComponent, EditModalComponent, ProjectsComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  isModalOpen = false;
  modalTitle = '';
  selectedData: any = null;
  
  jobs: any[] = [];
  educations: any[] = [];
  skills: any[] = [];
  projects: any[] = [];
  currentType: 'experience' | 'education' | 'basic' | 'skills' | 'project' = 'experience';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.show().subscribe({
      next: (res: any) => {
        this.profileData = res;
        this.educations = res.educations || [];
        this.jobs = res.experiences || [];
        this.skills = res.skills || [];
        this.projects = res.projects || [];
      },
      error: (err: any) => console.error('Error al cargar perfil:', err)
    });
  }

  handleEditBasic() {
    this.currentType = 'basic';
    this.modalTitle = 'Editar Información Profesional';
    // Mapeamos lo que viene de Laravel al formato del modal
    this.selectedData = {
      name: this.profileData.name,
      title: this.profileData.profile?.title || this.profileData.title,
      location: this.profileData.profile?.location || this.profileData.location,
      biography: this.profileData.profile?.biography || this.profileData.biography
    };
    this.isModalOpen = true;
  }

  handleAdd(type: 'experience' | 'education'| 'project') {
    this.currentType = type;
    this.selectedData = null;
    this.modalTitle = type === 'experience' ? 'Añadir Experiencia' : type === 'project' ? 'Añadir Proyecto' : 'Añadir Formación';
    this.isModalOpen = true;
  }

  handleEdit(data: any, type: 'experience' | 'education' | 'project') {
    this.currentType = type;
    this.selectedData = data;
    this.modalTitle = type === 'experience' ? 'Editar Experiencia' : type === 'project' ? 'Editar Proyecto' : 'Editar Formación';
    this.isModalOpen = true;
  }

saveChanges(formData: any) {
  let request: Observable<any> | null = null;

  // Lógica de asignación según el tipo
  if (this.currentType === 'project') {
    request = (this.selectedData?.id)
      ? this.profileService.updateProject(this.selectedData.id, formData)
      : this.profileService.addProject(formData);
      
  } else if (this.currentType === 'basic') {
    request = this.profileService.updateBasicInfo(formData);

  } else if (this.currentType === 'experience') {
    request = (this.selectedData?.id)
      ? this.profileService.updateExperience(this.selectedData.id, formData)
      : this.profileService.addExperience(formData);

  } else if (this.currentType === 'education') {
    request = (this.selectedData?.id)
      ? this.profileService.updateEducation(this.selectedData.id, formData)
      : this.profileService.addEducation(formData);
  }

  // EJECUCIÓN DE LA PETICIÓN
  if (request) {
    request.subscribe({
      next: (res: any) => {
        this.loadProfile(); // Refresca los datos en la UI
        this.isModalOpen = false;
        console.log(`${this.currentType} actualizado correctamente`);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar los cambios');
      }
    });
  } else {
    console.warn('No se ha definido una petición para el tipo:', this.currentType);
  }
}

deleteElement(item: any, type: 'experience' | 'education' | 'project') {
    // Inicializamos como null para que siempre tenga un valor inicial
    let request: Observable<any> | null = null; 

    if (type === 'experience') {
      request = this.profileService.deleteExperience(item.id);
    } else if (type === 'education') {
      request = this.profileService.deleteEducation(item.id);
    } else if (type === 'project') {
      request = this.profileService.deleteProject(item.id);
    }

    // Solo nos suscribimos si request fue asignado correctamente
    if (request) {
      request.subscribe({
        next: () => this.loadProfile(),
        error: (err) => alert('No se pudo eliminar.')
      });
    }
}
}