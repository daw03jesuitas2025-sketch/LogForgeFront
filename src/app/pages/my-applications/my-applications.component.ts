import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
})
export class MyApplicationsComponent implements OnInit {
  appliedJobs: any[] = [];
  currentUser: any = null;
  private API_BASE = `https://${environment.apiUrl}/api`; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadMyApplications();
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
    this.http.get<any>(`${this.API_BASE}/me`, this.getHeaders()).subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.log('Error User:', err)
    });
  }

  loadMyApplications() {
    this.http.get<any[]>(`${this.API_BASE}/my-applications`, this.getHeaders()).subscribe({
      next: (data) => {
        this.appliedJobs = data;
        console.log('Mis postulaciones:', data);
      },
      error: (err) => console.error('Error MyApps:', err)
    });
  }
}