import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { filter, map } from 'rxjs/operators';

import { PageHeaderComponent } from '@shared/components/ui/page-header/page-header.component';
import { CONFIRMATION_SERVICE } from '@shared/services/ui/confirmation/interface/confirmation.interface';
import {
  NoteDetailComponent,
  NoteFormComponent,
  NoteListItemComponent,
} from '@features/notes/components';
import { Note } from '@features/notes/interfaces/notes.interface';
import { NotesStore } from '@features/notes/store/notes.store';
import { TagsStore } from '@features/notes/store/tags.store';

@Component({
  selector: 'app-note',
  imports: [
    CommonModule,
    PageHeaderComponent,
    NoteFormComponent,
    NoteListItemComponent,
    NoteDetailComponent,
    Button,
    DialogModule,
  ],

  templateUrl: './note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NoteComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(CONFIRMATION_SERVICE);
  readonly notesStore = inject(NotesStore);
  readonly tagsStore = inject(TagsStore);

  readonly showNoteForm = signal<boolean>(false);
  readonly editingNote = signal<Note | null>(null);

  private readonly routeParams = toSignal(this.route.paramMap);
  private readonly routeUrl = toSignal(
    this.route.url.pipe(map((segments) => segments.map((segment) => segment.path))),
  );

  readonly allTags = this.tagsStore.tags;

  currentTag = computed(() => {
    const params = this.routeParams();
    const tag = params?.get('tag') || null;

    this.notesStore.setFilterTag(tag);
    return tag;
  });

  isArchivedView = computed(() => {
    const url = this.routeUrl();
    const isArchived = url?.includes('archived') || false;

    this.notesStore.setShowArchived(isArchived);
    return isArchived;
  });

  filteredNotes = this.notesStore.filteredNotes;
  selectedNote = this.notesStore.selectedNote;
  isLoading = this.notesStore.isLoading;

  viewTitle = computed(() => {
    if (this.isArchivedView()) {
      return 'Archived Notes';
    } else if (this.currentTag()) {
      return `Notes tagged with: ${this.currentTag()}`;
    } else {
      return 'All Notes';
    }
  });

  onSearchChange(searchTerm: string): void {
    this.notesStore.searchNotes(searchTerm);
  }

  onCreateNote(): void {
    this.editingNote.set(null);
    this.showNoteForm.set(true);
  }

  onNoteClick(note: Note): void {
    this.notesStore.setSelectedNote(note);
  }

  onEditNote(note: Note): void {
    this.editingNote.set(note);
    this.showNoteForm.set(true);
  }

  onSaveNote(noteData: Partial<Note>): void {
    const isEditing = this.editingNote() !== null;

    if (isEditing) {
      this.notesStore.updateNote({ id: noteData.id!, note: noteData });
    } else {
      this.notesStore.createNote(noteData);
    }

    this.showNoteForm.set(false);
    this.editingNote.set(null);
  }

  onCancelForm(): void {
    this.showNoteForm.set(false);
    this.editingNote.set(null);
  }

  onArchiveNote(note: Note): void {
    this.confirmationService
      .confirmArchive(
        'Are you sure you want  to archive this note? You can find it in the Archived Notes sections and restore it anytime.',
      )
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe({
        next: () => {
          this.notesStore.toggleArchive(note.id);
        },
      });
  }

  onDeleteNote(note: Note): void {
    this.confirmationService
      .confirmDelete(
        'Are you sure you want to permanently delete this note? This action cannot be undone.',
      )
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe({
        next: () => {
          this.notesStore.deleteNote(note.id);
        },
      });
  }
}
