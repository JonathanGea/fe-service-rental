import { Routes } from '@angular/router';
import { DashboardPageComponent } from './admin/dashboard/dashboard';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    data: {
      title: 'Dashboard',
      breadcrumbs: ['Dashboards', 'Dashboard']
    }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
