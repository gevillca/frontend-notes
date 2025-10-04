import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

import { LoadingComponent } from '@shared/components/ui/loading/loading.component';
import { ThemeService } from '@shared/theme/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('frontend-notes');
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.setTheme(this.themeService.theme());
  }
}
