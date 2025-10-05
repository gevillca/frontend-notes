import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
})
export class NoteListItemComponent {
  // Inputs
  note = input.required<Note>();
  allTags = input<Tag[]>([]);
  isSelected = input<boolean>(false);

  // Outputs
  noteClick = output<Note>();

  // Event Handlers - Clean & SOLID
  onClick(): void {
    this.noteClick.emit(this.note());
  }

  getTagNames(): string[] {
    // TODO: Implementar lógica de obtención de nombres de tags
    return [];
  }
}
