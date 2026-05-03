import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { CompanyService } from '@services/company.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-profile.component.html'
})
export class CompanyProfileComponent implements OnInit {
  profile: any = {
    company_name: '',
    website: '',
    description: '',
    logo: null
  };

  loading: boolean = true;
  successMessage: string = '';
  selectedFile: File | null = null;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.companyService.getMyProfile().subscribe({
      next: (data: any) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profile.logo = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('company_name', this.profile.company_name || '');
    formData.append('website', this.profile.website || '');
    formData.append('description', this.profile.description || '');
    formData.append('_method', 'PUT');

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.companyService.updateProfile(formData).subscribe({
      next: (response: any) => {
        this.successMessage = '¡Perfil actualizado con éxito!';
        this.profile = response;
        this.selectedFile = null;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error en update:', err);
        alert('Error al actualizar el perfil');
      }
    });
  }

  getFullImageUrl(logoPath: string | null): string {
    if (!logoPath) return '';
    if (logoPath.startsWith('data:')) return logoPath;
    if (logoPath.startsWith('http')) return logoPath;

    const baseUrl = environment.apiUrl.includes('http')
      ? environment.apiUrl
      : `https://${environment.apiUrl}`;

    return `${baseUrl}${logoPath}`;
  }
}