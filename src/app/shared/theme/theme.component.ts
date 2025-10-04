import { Component, computed, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { ThemeService } from '@shared/theme/services/theme.service';

@Component({
  selector: 'app-theme',
  imports: [TooltipModule, Button],
  templateUrl: './theme.component.html',
})
export class ThemeComponent {
  private readonly themeService = inject(ThemeService);

  readonly icon = computed(() => {
    const theme = this.themeService.theme();
    const resolvedTheme = this.themeService.resolvedTheme();

    if (theme === 'system') {
      return resolvedTheme === 'dark' ? 'pi pi-moon' : 'pi pi-sun';
    }
    return theme === 'dark' ? 'pi pi-moon' : 'pi pi-sun';
  });

  readonly tooltipLabel = computed(() => {
    const resolvedTheme = this.themeService.resolvedTheme();
    return resolvedTheme === 'dark' ? 'Claro' : 'Oscuro';
  });

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
