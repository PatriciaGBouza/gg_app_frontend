import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  @Input() view: 'principal' | 'authenticated' = 'principal';


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  constructor(public authService: AuthService, private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      "settings",
      sanitizer.bypassSecurityTrustResourceUrl("/assets/images/settings.svg")
    );
    iconRegistry.addSvgIcon(
      "bell",
      sanitizer.bypassSecurityTrustResourceUrl("/assets/images/bell.svg")
    );
  
  }
}
