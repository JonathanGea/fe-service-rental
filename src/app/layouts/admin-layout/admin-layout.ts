import { DOCUMENT, NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { AdminNavbarComponent } from '../../shared/ui/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../shared/ui/admin-sidebar/admin-sidebar.component';
import { OverlayBackdropComponent } from '../../shared/ui/overlay-backdrop/overlay-backdrop.component';

@Component({
  selector: 'app-admin-layout',
  imports: [
    AdminNavbarComponent,
    AdminSidebarComponent,
    NgClass,
    OverlayBackdropComponent,
    RouterOutlet
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
  pageTitle = 'Analytics';
  breadcrumbs: string[] = ['Dashboards', 'Analytics'];
  isSidebarCollapsed = false;
  mobileSidebarOpen = false;
  isConfiguratorOpen = false;
  isNavbarFixed = true;
  isSidenavMini = false;
  isDarkMode = false;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const activeRoute = this.getDeepestChild(this.route);
        const data = activeRoute.snapshot.data;
        this.pageTitle = data['title'] ?? this.pageTitle;
        this.breadcrumbs = data['breadcrumbs'] ?? this.breadcrumbs;
      });
  }

  onToggleCollapse(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isSidenavMini = this.isSidebarCollapsed;
  }

  onOpenMobileSidebar(): void {
    this.mobileSidebarOpen = true;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

  toggleConfigurator(): void {
    this.isConfiguratorOpen = !this.isConfiguratorOpen;
    this.setBodyScrollLocked(this.isConfiguratorOpen);
  }

  closeConfigurator(): void {
    this.isConfiguratorOpen = false;
    this.setBodyScrollLocked(false);
  }

  toggleNavbarFixed(): void {
    this.isNavbarFixed = !this.isNavbarFixed;
  }

  toggleSidenavMini(): void {
    this.isSidenavMini = !this.isSidenavMini;
    this.isSidebarCollapsed = this.isSidenavMini;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  onLogout(): void {}

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  private setBodyScrollLocked(locked: boolean): void {
    if (!this.document?.body) {
      return;
    }
    this.document.body.style.overflow = locked ? 'hidden' : '';
  }
}
