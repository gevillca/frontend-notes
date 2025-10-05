import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime } from 'rxjs/operators';

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
  placeholder = input<string>('Search...');
  debounceTime = input<number>(300);

  searchChange = output<string>();

  searchControl = new FormControl<string>('', { nonNullable: true });

  constructor() {
    effect(() => {
      const debounce = this.debounceTime();

      this.searchControl.valueChanges.pipe(debounceTime(debounce)).subscribe((value: string) => {
        this.searchChange.emit(value);
      });
    });
  }
}
