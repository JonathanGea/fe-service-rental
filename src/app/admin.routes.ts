import { Routes } from '@angular/router';
import { AnalyticsPageComponent } from './admin/analytics/analytics.component';

export const adminRoutes: Routes = [
  {
    path: 'analytics',
    component: AnalyticsPageComponent,
    data: {
      title: 'Analytics',
      breadcrumbs: ['Dashboards', 'Analytics']
    }
  },
  {
    path: '',
    redirectTo: 'analytics',
    pathMatch: 'full'
  }
];
