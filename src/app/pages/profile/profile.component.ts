import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { ExperiencesComponent } from './experiences/experiences.component';
import { EducationsComponent } from './educations/educations.component';
import { SkillsComponent } from './skills/skills.component';
import { CvSidebarComponent } from './cv-sidebar/cv-sidebar.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ExperiencesComponent, EducationsComponent, SkillsComponent, CvSidebarComponent, EditModalComponent],
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
  currentType: 'experience' | 'education' | 'basic' | 'skills' = 'experience';

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

  handleAdd(type: 'experience' | 'education') {
    this.currentType = type;
    this.selectedData = null;
    this.modalTitle = type === 'experience' ? 'Añadir Experiencia' : 'Añadir Formación';
    this.isModalOpen = true;
  }

  handleEdit(data: any, type: 'experience' | 'education') {
    this.currentType = type;
    this.selectedData = data;
    this.modalTitle = type === 'experience' ? 'Editar Experiencia' : 'Editar Formación';
    this.isModalOpen = true;
  }

 saveChanges(formData: any) {
  let request: Observable<any> | null = null;

  if (this.currentType === 'basic') {
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
}
  deleteElement(item: any, type: 'experience' | 'education') {
    const request = type === 'experience' 
      ? this.profileService.deleteExperience(item.id) 
      : this.profileService.deleteEducation(item.id);

    request.subscribe({
      next: () => this.loadProfile(),
      error: (err) => alert('No se pudo eliminar.')
    });
  }

}