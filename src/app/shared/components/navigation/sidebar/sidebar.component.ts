import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';

import { AppMenu } from './menu/app.menu.component';

@Component({
  selector: 'app-sidebar',
  imports: [AppMenu],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sidebar-collapsed]': 'collapsed()',
    '[class.sidebar-expanded]': '!collapsed()',
  },
})
export class Sidebar {
  readonly collapsed = input<boolean>(false);

  // 📋 Menú con comportamiento expandible/colapsable
  protected readonly menuItems: PanelMenuModule[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      // routerLink: ['/admin/dashboard'],
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['/admin/dashboard'],
        },
      ],
    },
    {
      label: 'Gestión de Usuarios',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Lista de Usuarios',
          icon: 'pi pi-fw pi-list',
          routerLink: ['/admin/users'],
        },
        {
          label: 'Crear Usuario',
          icon: 'pi pi-fw pi-user-plus',
          routerLink: ['/admin/users/create'],
        },
        {
          label: 'Permisos',
          icon: 'pi pi-fw pi-key',
          routerLink: ['/admin/users/permissions'],
        },
      ],
    },

    {
      label: 'Configuración',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'General',
          icon: 'pi pi-fw pi-sliders-h',
          routerLink: ['/admin/settings/general'],
        },
        {
          label: 'Seguridad',
          icon: 'pi pi-fw pi-shield',
          routerLink: ['/admin/settings/security'],
        },
        {
          label: 'Notificaciones',
          icon: 'pi pi-fw pi-bell',
          items: [
            {
              label: 'Email',
              icon: 'pi pi-fw pi-envelope',
              routerLink: ['/admin/settings/notifications/email'],
            },
            {
              label: 'SMS',
              icon: 'pi pi-fw pi-mobile',
              routerLink: ['/admin/settings/notifications/sms'],
            },
            {
              label: 'Push',
              icon: 'pi pi-fw pi-send',
              routerLink: ['/admin/settings/notifications/push'],
            },
          ],
        },
        {
          label: 'Integraciones',
          icon: 'pi pi-fw pi-bars',
          routerLink: ['/admin/settings/integrations'],
        },
      ],
    },
  ];
}
