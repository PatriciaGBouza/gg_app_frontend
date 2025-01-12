import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ILoadedUserData } from '../../interfaces/user/iloaded-user-data';
import { UserStateService } from '../../services/user-state.service';
import { UserService } from '../../services/user.service';
import { BalanceService } from '../../services/balance.service';
import { DecimalPipe } from '@angular/common';
import { MembershipService } from '../../services/membership.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  providers: [DecimalPipe]
})
export class NavComponent implements OnInit {
  user: ILoadedUserData | null = null;
  userId: string | null = null;
  userImageUrl: string = 'assets/user_default.png';
  sidePanelOpen = false;
  userName: string = 'Usuario Feliz';
  userBalance = 0;
  updatedBalance: string = '';


  constructor(
    public authService: AuthService,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private userStateService: UserStateService,
    private userService: UserService,
    private membershipService: MembershipService,
    private decimalPipe: DecimalPipe
  ) {
    iconRegistry.addSvgIcon(
      'settings',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/settings.svg')
    );
    iconRegistry.addSvgIcon(
      'bell',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/bell.svg')
    );
  }
  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.userStateService.user$.subscribe(user => {
      this.user = user;
      this.updateUserImageUrl();  // Update image URL whenever user data changes
    });
    this.userName = this.userService.getUserName() || 'Usuario Feliz';
    this.loadUserBalance();
  }

  private loadUserFromLocalStorage(): void {
    const userFromLocalStorage = this.userService.getUserFromLocalStorage();
    if (userFromLocalStorage) {
      this.userStateService.setUser(userFromLocalStorage);
    }
  }

  private updateUserImageUrl(): void {
    if (this.user && this.user.image_url) {
      this.userImageUrl = this.user.image_url;
    } else {
      this.userImageUrl = 'assets/user_default.png';
    }
  }


  private loadUserBalance(): void {
    this.membershipService.getUserBalance().subscribe({
      next: (response) => {
        if (response.success) {
          this.userBalance = response.data.total_balance;
          this.updatedBalance = this.decimalPipe.transform(this.userBalance, '1.2-2') + ' €';
        } else {
        }
      },
      error: (error) => {
        console.error('Error fetching user balance:', error);
      }
    });
  }


  toggleSidePanel() {
    this.sidePanelOpen = !this.sidePanelOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.sidePanelOpen = !this.sidePanelOpen;
  }
}
