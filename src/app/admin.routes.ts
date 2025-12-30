import { Routes } from '@angular/router';
import { DashboardPageComponent } from './admin/dashboard/dashboard';
import { VehiclesListPageComponent } from './admin/vehicles/list/vehicles-list.component';
import { VehicleFormPageComponent } from './admin/vehicles/form/vehicle-form.component';
import { VehicleDetailPageComponent } from './admin/vehicles/detail/vehicle-detail.component';
import { VehiclePhotosPageComponent } from './admin/vehicles/photos/vehicle-photos.component';
import { BrandsListPageComponent } from './admin/brands/list/brands-list.component';
import { BrandFormPageComponent } from './admin/brands/form/brand-form.component';
import { VehicleTypesListPageComponent } from './admin/vehicle-types/list/vehicle-types-list.component';
import { VehicleTypeFormPageComponent } from './admin/vehicle-types/form/vehicle-type-form.component';

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
    path: 'brands',
    component: BrandsListPageComponent,
    data: {
      title: 'Brand',
      breadcrumbs: ['Brand', 'List']
    }
  },
  {
    path: 'brands/new',
    component: BrandFormPageComponent,
    data: {
      title: 'Tambah Brand',
      breadcrumbs: ['Brand', 'Tambah']
    }
  },
  {
    path: 'brands/:id/edit',
    component: BrandFormPageComponent,
    data: {
      title: 'Edit Brand',
      breadcrumbs: ['Brand', 'Edit']
    }
  },
  {
    path: 'vehicle-types',
    component: VehicleTypesListPageComponent,
    data: {
      title: 'Tipe Kendaraan',
      breadcrumbs: ['Tipe Kendaraan', 'List']
    }
  },
  {
    path: 'vehicle-types/new',
    component: VehicleTypeFormPageComponent,
    data: {
      title: 'Tambah Tipe Kendaraan',
      breadcrumbs: ['Tipe Kendaraan', 'Tambah']
    }
  },
  {
    path: 'vehicle-types/:id/edit',
    component: VehicleTypeFormPageComponent,
    data: {
      title: 'Edit Tipe Kendaraan',
      breadcrumbs: ['Tipe Kendaraan', 'Edit']
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
