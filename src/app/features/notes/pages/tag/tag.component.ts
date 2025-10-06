import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { filter } from 'rxjs/operators';

import { PageHeaderComponent } from '@shared/components/ui/page-header/page-header.component';
import { CONFIRMATION_SERVICE } from '@shared/services/ui/confirmation/interface/confirmation.interface';
import { NOTIFICATIONS_MESSAGES } from '@shared/services/ui/notification/constants/notification-messages.constants';
import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';
import {
  NoteDetailComponent,
  NoteFormComponent,
  NoteListItemComponent,
} from '@features/notes/components';
import { Note } from '@features/notes/interfaces/notes.interface';
import { NotesStore } from '@features/notes/store/notes.store';
import { TagsStore } from '@features/notes/store/tags.store';

@Component({
  selector: 'app-tag',
  imports: [
    CommonModule,
    PageHeaderComponent,
    NoteFormComponent,
    NoteListItemComponent,
    NoteDetailComponent,
    Button,
    DialogModule,
  ],
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TagComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(CONFIRMATION_SERVICE);
  private readonly notificationService = inject(NOTIFICATION_SERVICE);
  readonly notesStore = inject(NotesStore);
  readonly tagsStore = inject(TagsStore);

  readonly showNoteForm = signal<boolean>(false);
  readonly editingNote = signal<Note | null>(null);
  readonly formKey = signal<number>(0);

  private readonly routeParams = toSignal(this.route.paramMap);

  readonly allTags = this.tagsStore.tags;

  readonly currentTagId = computed(() => {
    const params = this.routeParams();
    return params?.get('tag') || null;
  });

  private readonly syncTagFilterWithRoute = effect(() => {
    const tagId = this.currentTagId();
    this.notesStore.setFilterTag(tagId);
    this.notesStore.setShowArchived(false);

    this.notesStore.setSelectedNote(null);
  });

  readonly currentTag = computed(() => {
    const tagId = this.currentTagId();
    if (!tagId) return null;

    return this.allTags().find((tag) => tag.id === tagId) || null;
  });

  readonly filteredNotes = this.notesStore.filteredNotes;
  readonly selectedNote = this.notesStore.selectedNote;
  readonly isLoading = this.notesStore.isLoading;

  readonly viewTitle = computed(() => {
    const tag = this.currentTag();
    return tag ? `Notes Tagged: ${tag.name}` : 'Tagged Notes';
  });

  readonly searchPlaceholder = computed(() => {
    const tag = this.currentTag();
    return tag ? `Search in ${tag.name} notes...` : 'Search by title, content, or tags...';
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
      this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_UPDATED);
    } else {
      this.notesStore.createNote(noteData);
      this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_CREATED);
    }

    this.closeNoteForm();
  }

  onCancelForm(): void {
    this.closeNoteForm();
  }

  onArchiveNote(note: Note): void {
    this.confirmationService
      .confirmArchive(
        'Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it anytime.',
      )
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe({
        next: () => {
          this.notesStore.toggleArchive(note.id);
          this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_ARCHIVED);
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
          this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_DELETED);
        },
      });
  }

  private closeNoteForm(): void {
    this.showNoteForm.set(false);
    this.editingNote.set(null);
    this.formKey.update((key) => key + 1);
  }
}
