import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from '@services/message.service';
import { UserService } from '@services/user.service';
import { environment } from '../../../environments/environment';
import { CompanyService } from '@services/company.service';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  jobOffers: any[] = [];
  appliedJobs: any[] = [];
  currentUser: any = null;
  suggestions: any[] = [];
  searchTerm: string = '';
  messages: any[] = [];
  companyProfile: any = null;


  // Inyectamos el UserService
  constructor(
    private http: HttpClient, 
    private messageService: MessageService,
    private userService: UserService 
  ) { }

  // Función para obtener la URL base limpia (evita el error de doble https://)
  private get API_BASE() {
    return environment.apiUrl.includes('http') 
      ? `${environment.apiUrl}/api` 
      : `https://${environment.apiUrl}/api`;
  }

  ngOnInit(): void {
    // 1. Cargar ofertas públicas (esta ruta es libre)
    this.http.get<any[]>(`${this.API_BASE}/job-offers`).subscribe({
      next: (data) => this.jobOffers = data,
      error: (err) => console.error('Error cargando ofertas:', err)
    });

    // 2. Cargar datos privados usando el UserService (esto arregla el 404)
    this.loadMyApplications();
    this.loadCurrentUser();
    this.loadSuggestions();
    this.loadMessages();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.log('Error User:', err)
    });
  }

  get filteredJobOffers() {
    if (!this.jobOffers) return [];
    return this.jobOffers.filter(job =>
      job.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadSuggestions() {
    this.http.get<any[]>(`${this.API_BASE}/suggestions`, this.getHeaders()).subscribe({
      next: (data) => this.suggestions = data,
      error: (err) => console.error('Error Suggestions:', err)
    });
  }

  loadMyApplications() {
    this.userService.getMyApplications().subscribe({
      next: (data) => {
        this.appliedJobs = data;
        console.log('Mis postulaciones cargadas correctamente');
      },
      error: (err) => console.error('Error MyApps:', err)
    });
  }

  postularse(jobId: number) {
    const payload = {
      job_offer_id: jobId,
      message: 'Hola, me interesa esta vacante.'
    };

    // Usamos el API_BASE corregido para evitar el doble https
    this.http.post(`${this.API_BASE}/applications`, payload, this.getHeaders()).subscribe({
      next: (res: any) => {
        alert('¡Postulación enviada con éxito!');
        this.loadMyApplications(); 
      },
      error: (err) => {
        alert('Error: ' + (err.error.message || 'No se pudo enviar'));
      }
    });
  }

  hasApplied(jobId: number): boolean {
    if (!this.appliedJobs) return false;
    return this.appliedJobs.some(app => 
      app.job_offer_id === jobId || 
      (app.job_offer && app.job_offer.id === jobId)
    );
  }

  loadMessages() {
    this.messageService.getMyMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => console.error('Error cargando mensajes:', err)
    });
  }

getFullImageUrl(logoPath: string | null | undefined): string {
  if (!logoPath) return '';
  if (logoPath.startsWith('data:') || logoPath.startsWith('http')) return logoPath;

  const baseUrl = environment.apiUrl.includes('http')
    ? environment.apiUrl
    : `https://${environment.apiUrl}`;

  // Aseguramos que la ruta pase por el symlink de storage de Laravel
  const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
  
  // Si tu path en la BD no incluye 'storage', lo añadimos aquí
  if (!cleanPath.includes('/storage/')) {
      return `${baseUrl}/storage${cleanPath}`;
  }

  return `${baseUrl}${cleanPath}`;
}
}