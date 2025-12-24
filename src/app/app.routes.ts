import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { adminRoutes } from './admin.routes';
import { publicRoutes } from './public.routes';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: publicRoutes
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: adminRoutes
  },
  {
    path: '**',
    redirectTo: ''
  }
];
