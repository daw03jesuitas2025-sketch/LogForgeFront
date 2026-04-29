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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadMyApplications();
  }

  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  loadCurrentUser() {
    this.http.get<any>(`https://${environment.apiUrl}/api/me`).subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.log('Error User:', err)
    });
  }

  loadMyApplications() {
    this.http.get<any[]>(`https://${environment.apiUrl}/api/my-applications`).subscribe({
      next: (data) => {
        this.appliedJobs = data;
        console.log('Mis postulaciones:', data);
      },
      error: (err) => console.error('Error MyApps:', err)
    });
  }
}