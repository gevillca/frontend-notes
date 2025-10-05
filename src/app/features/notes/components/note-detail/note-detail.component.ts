import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tag as PrimeTag } from 'primeng/tag';

import { Note } from '../../interfaces/notes.interface';
import { Tag } from '../../interfaces/tag.interface';

@Component({
  selector: 'app-note-detail',
  imports: [ButtonModule, PrimeTag, DatePipe],
  templateUrl: './note-detail.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailComponent {
  note = input<Note | null>(null);
  allTags = input<Tag[]>([]);

  archiveNote = output<Note>();
  deleteNote = output<Note>();
  editNote = output<Note>();
  toggleFavorite = output<Note>();

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

  onToggleFavorite(): void {
    const currentNote = this.note();
    if (currentNote) {
      this.toggleFavorite.emit(currentNote);
    }
  }

  // Helper Methods - TODO: Implementar lógica completa
  getTagNames(): string[] {
    // TODO: Implementar obtención de nombres de tags
    return [];
  }
}
