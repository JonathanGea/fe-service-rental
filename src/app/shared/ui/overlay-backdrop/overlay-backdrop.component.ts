import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-overlay-backdrop',
  standalone: true,
  imports: [NgClass],
  templateUrl: './overlay-backdrop.component.html'
})
export class OverlayBackdropComponent {
  @Input() open = false;
  @Input() className = '';
  @Output() backdropClick = new EventEmitter<void>();
}
