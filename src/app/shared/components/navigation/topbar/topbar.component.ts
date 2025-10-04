import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';

import { LayoutService } from '@shared/layouts/main-layout/service/layout.service';
import { ThemeComponent } from '@shared/theme/theme.component';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, StyleClassModule, ThemeComponent, Avatar, Menu, Button],
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  userMenuItems: MenuItem[] = [];

  public readonly layoutService = inject(LayoutService);
  private readonly authService = inject(AuthService);

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
    ];
  }

  onLogout() {
    this.authService.logout();
  }
}
