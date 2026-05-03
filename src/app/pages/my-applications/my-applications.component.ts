import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service'; // Asegúrate de que la ruta coincide con tu carpeta

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-applications.component.html',
})
export class MyApplicationsComponent implements OnInit {
  appliedJobs: any[] = [];
  currentUser: any = null;
  loading: boolean = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // Cargamos la info del usuario
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUser = user,
      error: (err) => console.error('Error User:', err)
    });

    // Cargamos las aplicaciones (Arregla el 404)
    this.userService.getMyApplications().subscribe({
      next: (data) => {
        this.appliedJobs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error MyApps:', err);
        this.loading = false;
      }
    });
  }
}