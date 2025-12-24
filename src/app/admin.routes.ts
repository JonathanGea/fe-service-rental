import { Routes } from '@angular/router';
import { DashboardPageComponent } from './admin/dashboard/dashboard';
import { VehiclesListPageComponent } from './admin/vehicles/list/vehicles-list.component';
import { VehicleFormPageComponent } from './admin/vehicles/form/vehicle-form.component';
import { VehicleDetailPageComponent } from './admin/vehicles/detail/vehicle-detail.component';
import { VehiclePhotosPageComponent } from './admin/vehicles/photos/vehicle-photos.component';

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
    path: 'vehicles/new',
    component: VehicleFormPageComponent,
    data: {
      title: 'Tambah Kendaraan',
      breadcrumbs: ['Kendaraan', 'Tambah']
    }
  },
  {
    path: 'vehicles/:id/edit',
    component: VehicleFormPageComponent,
    data: {
      title: 'Edit Kendaraan',
      breadcrumbs: ['Kendaraan', 'Edit']
    }
  },
  {
    path: 'vehicles/:id/photos',
    component: VehiclePhotosPageComponent,
    data: {
      title: 'Foto Kendaraan',
      breadcrumbs: ['Kendaraan', 'Foto']
    }
  },
  {
    path: 'vehicles/:id',
    component: VehicleDetailPageComponent,
    data: {
      title: 'Detail Kendaraan',
      breadcrumbs: ['Kendaraan', 'Detail']
    }
  },
  {
    path: 'vehicles',
    component: VehiclesListPageComponent,
    pathMatch: 'full',
    data: {
      title: 'Kendaraan',
      breadcrumbs: ['Kendaraan', 'List']
    }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
