import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicFooterComponent } from '../../shared/ui/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../../shared/ui/public-header/public-header.component';

@Component({
  selector: 'app-public-layout',
  imports: [PublicFooterComponent, PublicHeaderComponent, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayoutComponent {}
