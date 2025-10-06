import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { Menu } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';

import { LayoutService } from '@shared/layouts/main-layout/service/layout.service';
import { ThemeComponent } from '@shared/theme/theme.component';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, StyleClassModule, ThemeComponent, Avatar, Menu, Button, ChipModule],
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  userMenuItems: MenuItem[] = [];

  readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;
  readonly userAvatar = computed(() => this.user()?.avatarUrl || 'assets/images/no-image.jpg');
  readonly userEmail = computed(() => this.user()?.email || 'Usuario');
  readonly userInitial = computed(() => {
    const email = this.user()?.email || 'U';
    return email.charAt(0).toUpperCase();
  });

  constructor() {
    this.initializeUserMenu();
  }

  private initializeUserMenu() {
    this.userMenuItems = [
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout(),
      },
      {
        separator: true,
      },
      {
        label: this.userEmail(),
        icon: 'pi pi-user',
        disabled: true,
        styleClass: 'user-email-item',
      },
    ];
  }

  onLogout() {
    this.authService.logout();
  }
}
