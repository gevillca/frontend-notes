import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { filter } from 'rxjs/operators';

import { PageHeaderComponent } from '@shared/components/ui/page-header/page-header.component';
import { CONFIRMATION_SERVICE } from '@shared/services/ui/confirmation/interface/confirmation.interface';
import { NOTIFICATIONS_MESSAGES } from '@shared/services/ui/notification/constants/notification-messages.constants';
import { NOTIFICATION_SERVICE } from '@shared/services/ui/notification/interface/notification.interface';
import { NoteDetailComponent, NoteListItemComponent } from '@features/notes/components';
import { Note } from '@features/notes/interfaces/notes.interface';
import { NotesStore } from '@features/notes/store/notes.store';
import { TagsStore } from '@features/notes/store/tags.store';

@Component({
  selector: 'app-archived',
  imports: [CommonModule, PageHeaderComponent, NoteListItemComponent, NoteDetailComponent, Button],
  templateUrl: './archived.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArchivedComponent {
  private readonly router = inject(Router);
  private readonly confirmationService = inject(CONFIRMATION_SERVICE);
  private readonly notificationService = inject(NOTIFICATION_SERVICE);
  readonly notesStore = inject(NotesStore);
  readonly tagsStore = inject(TagsStore);

  readonly allTags = this.tagsStore.tags;

  /**
   * Synchronizes the store to show archived notes
   * Ensures only archived notes are displayed in this view
   */
  private readonly syncArchivedView = effect(() => {
    // Always show archived notes in this view
    this.notesStore.setShowArchived(true);

    this.notesStore.setFilterTag(null);
  });

  readonly archivedNotes = this.notesStore.filteredNotes;
  readonly selectedNote = this.notesStore.selectedNote;
  readonly isLoading = this.notesStore.isLoading;

  onSearchChange(searchTerm: string): void {
    this.notesStore.searchNotes(searchTerm);
  }

  onNoteClick(note: Note): void {
    this.notesStore.setSelectedNote(note);
  }

  // onEditNote(_note: Note): void {
  //   // Archived notes cannot be edited directly
  //   // User must unarchive first
  //   console.warn('Archived notes cannot be edited. Please unarchive the note first.');
  // }

  onUnarchiveNote(note: Note): void {
    this.confirmationService
      .confirmArchive(
        'Are you sure you want to unarchive this note? It will be moved back to your active notes.',
      )
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe({
        next: () => {
          this.notesStore.toggleArchive(note.id);
          this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_UNARCHIVED);
          // Clear selection after unarchive
          if (this.selectedNote()?.id === note.id) {
            this.notesStore.setSelectedNote(null);
          }
        },
      });
  }

  onDeleteNote(note: Note): void {
    this.confirmationService
      .confirmDelete(
        'Are you sure you want to permanently delete this archived note? This action cannot be undone and the note will be lost forever.',
      )
      .pipe(filter((confirmed) => confirmed === true))
      .subscribe({
        next: () => {
          this.notesStore.deleteNote(note.id);
          this.notificationService.success(NOTIFICATIONS_MESSAGES.NOTE_DELETED);
        },
      });
  }

  onArchiveNote(note: Note): void {
    this.onUnarchiveNote(note);
  }

  goToActiveNotes(): void {
    this.router.navigate(['/notes']);
  }
}
