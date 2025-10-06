import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime } from 'rxjs/operators';

import { SEARCH_CONFIG } from '@shared/constants/query-params.constants';

/**
 * Generic reusable search input using Reactive Forms
 *
 * @example
 * <app-search-input
 *   [placeholder]="'Search...'"
 *   [debounceTime]="300"
 *   (searchChange)="onSearch($event)">
 * </app-search-input>
 */
@Component({
  selector: 'app-search-input',
  imports: [ReactiveFormsModule, InputTextModule, InputIconModule, IconField],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  private readonly destroyRef = inject(DestroyRef);

  placeholder = input<string>(SEARCH_CONFIG.PLACEHOLDER_DEFAULT);
  debounceTime = input<number>(SEARCH_CONFIG.DEBOUNCE_TIME);
  value = input<string>('');

  searchChange = output<string>();

  searchControl = new FormControl<string>('', { nonNullable: true });

  /**
   * Synchronizes the input value from parent component with the form control.
   * Prevents infinite loops by checking if values are different and not emitting events.
   */
  private readonly syncValueEffect = effect(() => {
    const initialValue = this.value();
    if (initialValue !== this.searchControl.value) {
      this.searchControl.setValue(initialValue, { emitEvent: false });
    }
  });

  constructor() {
    /**
     * Emits search changes with debounce.
     * Uses takeUntilDestroyed to prevent memory leaks.
     */
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounceTime()), takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => {
        this.searchChange.emit(value);
      });
  }
}
