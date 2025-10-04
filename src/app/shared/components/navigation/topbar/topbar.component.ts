import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { StyleClassModule } from 'primeng/styleclass';
import { Tooltip } from 'primeng/tooltip';

import { LayoutService } from '@shared/layouts/main-layout/service/layout.service';
import { ThemeComponent } from '@shared/theme/theme.component';

@Component({
  selector: 'app-topbar',
  imports: [RouterModule, StyleClassModule, ThemeComponent, Tooltip, Avatar, Menu, Button],
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  userMenuItems: MenuItem[] = [];

  public readonly layoutService = inject(LayoutService);

  constructor() {
    this.initializeUserMenu();
  }

  private initializeUserMenu() {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.onProfile(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.onSettings(),
      },
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        command: () => this.onCalendar(),
      },
      {
        label: 'Inbox',
        icon: 'pi pi-inbox',
        command: () => this.onInbox(),
      },
      {
        separator: true,
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout(),
      },
    ];
  }

  onProfile() {
    // Implementar navegación al perfil
    console.log('Navigate to profile');
  }

  onSettings() {
    // Implementar navegación a configuración
    console.log('Navigate to settings');
  }

  onCalendar() {
    // Implementar navegación al calendario
    console.log('Navigate to calendar');
  }

  onInbox() {
    // Implementar navegación a la bandeja de entrada
    console.log('Navigate to inbox');
  }

  onLogout() {
    // Implementar lógica de logout
    console.log('Logout user');
  }
}
