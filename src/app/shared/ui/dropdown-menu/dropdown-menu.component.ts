import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [ClickOutsideDirective, NgClass],
  templateUrl: './dropdown-menu.component.html'
})
export class DropdownMenuComponent {
  @Input({ required: true }) menuId = '';
  @Input() isOpen = false;
  @Input() align: 'left' | 'right' = 'right';
  @Input() panelClass = '';
  @Output() close = new EventEmitter<void>();
}
