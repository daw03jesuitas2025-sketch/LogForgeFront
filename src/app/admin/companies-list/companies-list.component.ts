import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './companies-list.component.html'
})
export class CompaniesListComponent implements OnInit {
  companies: any[] = [];
  loading: boolean = true;
  showEditModal = false;
editingCompany: any = {};

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
  // Creamos una copia para no modificar la tabla antes de guardar
  this.editingCompany = { ...company, ...company.company_profile };
  this.showEditModal = true;
}
loadCompanies() {
  this.adminService.getCompanies().subscribe({
    next: (data) => this.companies = data,
    error: (err) => console.error(err)
  });
}
saveCompanyChanges() {
  this.adminService.updateCompanyProfile(this.editingCompany.user_id || this.editingCompany.id, this.editingCompany).subscribe({
    next: (res) => {
      this.showEditModal = false;
      this.loadCompanies(); // Recargamos la lista
      alert('Perfil actualizado');
    },
    error: (err) => alert('Error 404: Revisa que la ruta en api.php sea /companies/{id}/profile')
  });
}
}