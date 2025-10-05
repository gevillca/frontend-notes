import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { Tag as PrimeTag } from 'primeng/tag';

import { DateFormatPipe } from '@shared/pipes/date-format.pipe';

import { Note } from '../../interfaces/notes.interface';
import { Tag } from '../../interfaces/tag.interface';

@Component({
  selector: 'app-note-list-item',
  imports: [Ripple, PrimeTag, DateFormatPipe],
  templateUrl: './note-list-item.component.html',
  styleUrl: './note-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'note-list-item',
  },
})
export class NoteListItemComponent {
  // Inputs
  note = input.required<Note>();
  allTags = input<Tag[]>([]);
  isSelected = input<boolean>(false);

  // Outputs
  noteClick = output<Note>();

  /**
   * Computed CSS classes for the note item container
   * Uses Tailwind classes with dark mode support
   *
   * @remarks
   * This computed signal is necessary because Angular cannot bind
   * classes with colons (dark:) directly using [class.dark:xxx]
   */
  readonly itemClasses = computed(() => {
    const base =
      'p-4 border-b border-surface cursor-pointer transition-colors hover:bg-surface-hover';
    const selected = 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-l-primary';
    return this.isSelected() ? `${base} ${selected}` : base;
  });

  // Event Handlers
  onClick(): void {
    this.noteClick.emit(this.note());
  }

  getTagNames(): string[] {
    // TODO: Implementar lógica de obtención de nombres de tags
    return [];
  }
}
