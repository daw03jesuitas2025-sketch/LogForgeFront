import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [

  // PUBLIC (con layout)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
    ],
  },

  // AUTH
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // PRIVATE
  { path: 'landing', component: LandingComponent },

  { path: '**', redirectTo: '' },
];