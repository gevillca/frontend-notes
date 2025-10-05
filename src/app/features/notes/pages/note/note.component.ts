import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { map } from 'rxjs/operators';

import { PageHeaderComponent } from '@shared/components/ui/page-header/page-header.component';

import { NoteDetailComponent } from '../../components/note-detail/note-detail.component';
import { NoteFormComponent } from '../../components/note-form/note-form.component';
import { NoteListItemComponent } from '../../components/note-list/note-list-item.component';
import { Note } from '../../interfaces/notes.interface';
import { NotesService } from '../../services/notes.service';
import { TagsService } from '../../services/tags.service';

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
  private readonly notesService = inject(NotesService);
  private readonly tagsService = inject(TagsService);

  // Signals for reactive state management
  private readonly searchTerm = signal<string>('');
  private readonly isLoading = signal<boolean>(false);
  readonly showNoteForm = signal<boolean>(false);
  readonly editingNote = signal<Note | null>(null);
  readonly selectedNote = signal<Note | null>(null);

  private readonly routeParams = toSignal(this.route.paramMap);
  private readonly routeUrl = toSignal(
    this.route.url.pipe(map((segments) => segments.map((segment) => segment.path))),
  );

  // Load all notes and tags
  private readonly allNotes = toSignal(this.notesService.getAllNotes(), { initialValue: [] });
  readonly allTags = toSignal(this.tagsService.getAllTags(), { initialValue: [] });
  constructor() {
    console.log({ tags: this.allTags() });
  }

  // Computed signals derived from route data
  currentTag = computed(() => {
    const params = this.routeParams();
    return params?.get('tag') || null;
  });

  isArchivedView = computed(() => {
    const url = this.routeUrl();
    return url?.includes('archived') || false;
  });

  // Computed filtered notes based on current view and search
  filteredNotes = computed(() => {
    const notes = this.allNotes();
    const searchTerm = this.searchTerm().toLowerCase();
    const currentTag = this.currentTag();
    const isArchived = this.isArchivedView();

    let filtered = notes.filter((note) => note.archived === isArchived);

    // Filter by tag if specified
    if (currentTag) {
      filtered = filtered.filter((note) =>
        note.tags.some((tagId) => {
          const tag = this.allTags().find((t) => t.id === tagId);
          return tag?.name === currentTag;
        }),
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    }

    // Sort by last edited date (most recent first)
    return filtered.sort(
      (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime(),
    );
  });

  // View title computation
  viewTitle = computed(() => {
    if (this.isArchivedView()) {
      return 'Archived Notes';
    } else if (this.currentTag()) {
      return `Notes tagged with: ${this.currentTag()}`;
    } else {
      return 'All Notes';
    }
  });

  // Event handlers
  onSearchChange(searchTerm: string): void {
    console.log({ searchTerm });
    this.searchTerm.set(searchTerm);
  }

  onCreateNote(): void {
    this.editingNote.set(null);
    this.showNoteForm.set(true);
  }

  onNoteClick(note: Note): void {
    this.selectedNote.set(note);
  }

  onEditNote(note: Note): void {
    this.editingNote.set(note);
    this.showNoteForm.set(true);
  }

  onSaveNote(noteData: Partial<Note>): void {
    this.isLoading.set(true);

    const isEditing = this.editingNote() !== null;
    const request = isEditing
      ? this.notesService.updateNote(noteData.id!, noteData)
      : this.notesService.createNote(noteData);

    request.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showNoteForm.set(false);
        this.editingNote.set(null);
        // Notes will be automatically updated via the reactive stream
      },
      error: (error) => {
        console.error('Error saving note:', error);
        this.isLoading.set(false);
      },
    });
  }

  onCancelForm(): void {
    this.showNoteForm.set(false);
    this.editingNote.set(null);
  }

  onArchiveNote(note: Note): void {
    this.isLoading.set(true);
    this.notesService.updateNote(note.id, { ...note, archived: !note.archived }).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Notes will be automatically updated via the reactive stream
      },
      error: (error) => {
        console.error('Error archiving note:', error);
        this.isLoading.set(false);
      },
    });
  }

  onDeleteNote(note: Note): void {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      this.isLoading.set(true);
      this.notesService.deleteNote(note.id).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.selectedNote.set(null);
          // Notes will be automatically updated via the reactive stream
        },
        error: (error) => {
          console.error('Error deleting note:', error);
          this.isLoading.set(false);
        },
      });
    }
  }

  onToggleFavorite(note: Note): void {
    this.isLoading.set(true);
    this.notesService.updateNote(note.id, { ...note, isFavorite: !note.isFavorite }).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Notes will be automatically updated via the reactive stream
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        this.isLoading.set(false);
      },
    });
  }
}
