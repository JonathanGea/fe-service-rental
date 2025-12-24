import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, NgFor, NgIf],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  @Input() pageTitle = 'Analytics';
  @Input() breadcrumbs: string[] = ['Dashboards', 'Analytics'];
  @Input() isMobileSidebarOpen = false;
  @Input() userEmail = '';
  @Input() userRole = '';
  @Output() onToggleCollapse = new EventEmitter<void>();
  @Output() onOpenMobileSidebar = new EventEmitter<void>();
  @Output() onToggleMobileSidebar = new EventEmitter<void>();
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  @Output() onLogout = new EventEmitter<void>();

  notificationsCount = 11;
  isScrolled = false;
  isUserMenuOpen = false;

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isUserMenuOpen = false;
      });
  }

  onToggleMenu(): void {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      this.onToggleCollapse.emit();
      return;
    }
    if (this.isMobileSidebarOpen) {
      this.onToggleMobileSidebar.emit();
      return;
    }
    this.onOpenMobileSidebar.emit();
  }

  onSearchInput(value: string): void {
    this.searchQueryChange.emit(value);
  }

  onSearchEnter(value: string): void {
    this.searchSubmit.emit(value.trim());
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onLogoutClick(): void {
    this.isUserMenuOpen = false;
    this.onLogout.emit();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeUserMenu();
  }
}
