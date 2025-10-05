import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { Tag as PrimeTag } from 'primeng/tag';

import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { Note } from '@features/notes/interfaces/notes.interface';
import { Tag } from '@features/notes/interfaces/tag.interface';
import { TagsStore } from '@features/notes/store/tags.store';

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
  private readonly tagsStore = inject(TagsStore);

  note = input.required<Note>();
  allTags = input<Tag[]>([]);
  isSelected = input<boolean>(false);

  noteClick = output<Note>();

  readonly itemClasses = computed(() => {
    const base =
      'p-4 border-b border-surface cursor-pointer transition-colors hover:bg-surface-hover';
    const selected = 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-l-primary';
    return this.isSelected() ? `${base} ${selected}` : base;
  });

  readonly tagNames = computed(() => {
    const note = this.note();
    if (!note.tags || note.tags.length === 0) {
      return [];
    }

    const getTagName = this.tagsStore.getTagName();
    return note.tags.map((tagId) => getTagName(tagId)).filter((name) => name !== 'Unknown');
  });

  onClick(): void {
    this.noteClick.emit(this.note());
  }

  getTagNames(): string[] {
    return this.tagNames();
  }
}
