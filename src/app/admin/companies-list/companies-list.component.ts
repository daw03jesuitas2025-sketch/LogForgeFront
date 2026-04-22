import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies-list.component.html'
})
export class CompaniesListComponent implements OnInit {
  companies: any[] = [];
  loading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar empresas:', err);
        this.loading = false;
      }
    });
  }
}