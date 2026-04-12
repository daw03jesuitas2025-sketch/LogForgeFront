import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './admin/dashboard/dashboard.component';
import { CompanyDashboardComponent } from './features/company/dashboard/dashboard.component';

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
    ]
  },
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: AdminComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }