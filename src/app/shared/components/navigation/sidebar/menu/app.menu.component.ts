import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { AppMenuItem } from '../menu-item/app.menu-item.component';

@Component({
  selector: 'app-menu',
  imports: [RouterModule, AppMenuItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.menu.component.html',
})
export class AppMenu {
  readonly model = input<MenuItem[]>([]);
}
