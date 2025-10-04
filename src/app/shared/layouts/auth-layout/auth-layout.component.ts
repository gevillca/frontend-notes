import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeComponent } from '@shared/theme/theme.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, ThemeComponent],
  templateUrl: './auth-layout.component.html',
})
export default class AuthLayoutComponent {}
