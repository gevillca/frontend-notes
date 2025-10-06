import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

import { SearchInputComponent } from '../search-input/search-input.component';

/**
 * Reusable page header with title, search, and settings
 *
 * @example
 * <app-page-header
 *   [title]="'All Notes'"
 *   [showSearch]="true"
 *   [searchPlaceholder]="'Search...'"
 *   (searchChange)="onSearch($event)">
 * </app-page-header>
 */
@Component({
  selector: 'app-page-header',
  imports: [SearchInputComponent, Button],
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  title = input.required<string>();
  showSearch = input<boolean>(true);
  searchPlaceholder = input<string>('Search by title, content, or tags...');
  searchValue = input<string>('');
  showSettings = input<boolean>(true);

  searchChange = output<string>();
  settingsClick = output<void>();

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onSettingsClick(): void {
    this.settingsClick.emit();
  }
}
