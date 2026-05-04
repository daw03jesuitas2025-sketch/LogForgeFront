import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies-list.component.html'
})
export class CompaniesListComponent implements OnInit {
  companies: any[] = [];
  loading: boolean = true;

  constructor(private adminService: AdminService, private router: Router) {}

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
  deleteCompany(id: number) {
  if (confirm('¿Estás seguro de eliminar esta empresa? Se borrarán también sus ofertas y perfil.')) {
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.companies = this.companies.filter(c => c.id !== id);
        alert('Empresa eliminada correctamente');
      },
      error: (err) => alert('Error al eliminar la empresa')
    });
  }
}


editCompany(company: any) {

  this.router.navigate(['/admin/users'], { queryParams: { editId: company.id } });
}
}