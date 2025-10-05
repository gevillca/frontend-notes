import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tag as PrimeTag } from 'primeng/tag';

import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { Note } from '@features/notes/interfaces/notes.interface';
import { Tag } from '@features/notes/interfaces/tag.interface';
import { TagsStore } from '@features/notes/store/tags.store';

@Component({
  selector: 'app-note-detail',
  imports: [ButtonModule, PrimeTag, DateFormatPipe],
  templateUrl: './note-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailComponent {
  private readonly tagsStore = inject(TagsStore);

  note = input<Note | null>(null);
  allTags = input<Tag[]>([]);

  archiveNote = output<Note>();
  deleteNote = output<Note>();
  editNote = output<Note>();

  readonly tagNames = computed(() => {
    const currentNote = this.note();
    if (!currentNote?.tags || currentNote.tags.length === 0) {
      return [];
    }

    const getTagName = this.tagsStore.getTagName();
    return currentNote.tags.map((tagId) => getTagName(tagId)).filter((name) => name !== 'Unknown');
  });

  onEdit(): void {
    const currentNote = this.note();
    if (currentNote) {
      this.editNote.emit(currentNote);
    }
  }

  onArchive(): void {
    const currentNote = this.note();
    if (currentNote) {
      this.archiveNote.emit(currentNote);
    }
  }

  onDelete(): void {
    const currentNote = this.note();
    if (currentNote) {
      this.deleteNote.emit(currentNote);
    }
  }

  getTagNames(): string[] {
    return this.tagNames();
  }
}
