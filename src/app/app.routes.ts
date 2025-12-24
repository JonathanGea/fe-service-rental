import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { adminRoutes } from './admin.routes';
import { publicRoutes } from './public.routes';
import { authGuard } from './shared/guards/auth.guard';
import { LoginPageComponent } from './admin/login/login';

export const routes: Routes = [
  {
    path: 'admin/login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: publicRoutes
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: adminRoutes
  },
  {
    path: '**',
    redirectTo: ''
  }
];
