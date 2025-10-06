import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

import { SEARCH_CONFIG } from '@shared/constants/query-params.constants';

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
  searchPlaceholder = input<string>(SEARCH_CONFIG.PLACEHOLDER_NOTES);
  searchValue = input<string>('');
  showSettings = input<boolean>(true);

  searchChange = output<string>();
  settingsClick = output<void>();

  /**
   * Emits search changes to parent component.
   */
  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  /**
   * Emits settings click event to parent component.
   */
  onSettingsClick(): void {
    this.settingsClick.emit();
  }
}
