import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(CONFIRMATION_SERVICE);
  private readonly notificationService = inject(NOTIFICATION_SERVICE);
  readonly notesStore = inject(NotesStore);
  readonly tagsStore = inject(TagsStore);

  private readonly queryParams = toSignal(this.route.queryParamMap);

  readonly allTags = this.tagsStore.tags;

  /**
   * Synchronizes the store to show archived notes
   * Ensures only archived notes are displayed in this view
   */
  private readonly syncArchivedView = effect(() => {
    this.notesStore.setShowArchived(true);

    this.notesStore.setFilterTag(null);
  });

  private readonly syncSearchFromUrl = effect(() => {
    const params = this.queryParams();
    const search = params?.get('search') || '';

    this.notesStore.searchNotes(search);
  });

  readonly archivedNotes = this.notesStore.filteredNotes;
  readonly selectedNote = this.notesStore.selectedNote;
  readonly isLoading = this.notesStore.isLoading;

  onSearchChange(searchTerm: string): void {
    this.notesStore.searchNotes(searchTerm);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: searchTerm || null },
      queryParamsHandling: 'merge',
    });
  }

  onNoteClick(note: Note): void {
    this.notesStore.setSelectedNote(note);
  }

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
