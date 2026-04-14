import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    this.http.get<any>('http://127.0.0.1:8000/api/me', this.getHeaders()).subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.log('Error User:', err)
    });
  }

  loadMyApplications() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/my-applications', this.getHeaders()).subscribe({
      next: (data) => {
        this.appliedJobs = data;
        console.log('Mis postulaciones:', data);
      },
      error: (err) => console.error('Error MyApps:', err)
    });
  }
}