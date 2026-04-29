import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { LandingComponent } from './pages/user/landing.component';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './admin/dashboard/dashboard.component';
import { CompanyDashboardComponent } from './features/company/dashboard/dashboard.component';
import { MyApplicationsComponent } from './pages/my-applications/my-applications.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { CompaniesListComponent } from './admin/companies-list/companies-list.component';
import { JobOffersListComponent } from './admin/offers-list/offers-list.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { MyOffersComponent } from './company/my-offers/my-offers.component';

export const routes: Routes = [
  // RUTAS PÚBLICAS
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  // RUTAS PRIVADAS 
  {
    path: 'dashboard',
    component: AppLayoutComponent,
    children: [
      { path: 'landing', component: LandingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'company', component: CompanyDashboardComponent },
      { path: 'my-applications', component: MyApplicationsComponent },
      { path: 'company-profile', component: CompanyProfileComponent },
      { path: 'my-offers', component: MyOffersComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: AdminComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'offers', component: JobOffersListComponent },
      { path: 'companies', component: CompaniesListComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }