import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, pipe, switchMap, tap } from 'rxjs';

import { Note } from '../interfaces/notes.interface';
import { NotesService } from '../services/notes.service';

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filterTag: string | null;
  showArchived: boolean;
}

const initialState: NotesState = {
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  filterTag: null,
  showArchived: false,
};

export const NotesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    /**
     * Filters notes by: archived status, tag, and search term (title/content/tags)
     */
    filteredNotes: computed(() => {
      let notes = store.notes();
      const searchTerm = store.searchTerm().toLowerCase();
      const filterTag = store.filterTag();
      const showArchived = store.showArchived();

      // Filter by archived status
      notes = notes.filter((note) => note.archived === showArchived);

      // Filter by tag
      if (filterTag) {
        notes = notes.filter((note) => note.tags.includes(filterTag));
      }

      // Filter by search term
      if (searchTerm) {
        notes = notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
        );
      }

      return notes;
    }),
  })),

  withMethods((store, notesService = inject(NotesService)) => ({
    loadNotes: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          notesService.getAllNotes().pipe(
            tap((notes) =>
              patchState(store, {
                notes,
                isLoading: false,
                error: null,
              }),
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load notes',
              });
              return of([]);
            }),
          ),
        ),
      ),
    ),

    loadNoteById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          notesService.getNoteById(id).pipe(
            tap((note) =>
              patchState(store, {
                selectedNote: note,
                isLoading: false,
                error: null,
              }),
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load note',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    createNote: rxMethod<Partial<Note>>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((note) =>
          notesService.createNote(note).pipe(
            tap((newNote) =>
              patchState(store, {
                notes: [...store.notes(), newNote],
                isLoading: false,
                error: null,
              }),
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to create note',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    updateNote: rxMethod<{ id: string; note: Partial<Note> }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ id, note }) =>
          notesService.updateNote(id, note).pipe(
            tap((updatedNote) => {
              const notes = store.notes().map((n) => (n.id === id ? updatedNote : n));
              patchState(store, {
                notes,
                selectedNote: store.selectedNote()?.id === id ? updatedNote : store.selectedNote(),
                isLoading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to update note',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    deleteNote: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          notesService.deleteNote(id).pipe(
            tap(() => {
              const notes = store.notes().filter((n) => n.id !== id);
              patchState(store, {
                notes,
                selectedNote: store.selectedNote()?.id === id ? null : store.selectedNote(),
                isLoading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to delete note',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    /**
     * Debounced search (300ms delay to avoid excessive API calls)
     */
    searchNotes: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchTerm) => patchState(store, { searchTerm })),
      ),
    ),

    setSelectedNote(note: Note | null): void {
      patchState(store, { selectedNote: note });
    },

    setFilterTag(tag: string | null): void {
      patchState(store, { filterTag: tag });
    },

    toggleArchivedView(): void {
      patchState(store, { showArchived: !store.showArchived() });
    },

    setShowArchived(showArchived: boolean): void {
      patchState(store, { showArchived });
    },

    /**
     * Toggles note between archived/active states
     */
    toggleArchive: rxMethod<string>(
      pipe(
        switchMap((id) => {
          const note = store.notes().find((n) => n.id === id);
          if (!note) return of(null);

          return notesService.updateNote(id, { archived: !note.archived }).pipe(
            tap((updatedNote) => {
              const notes = store.notes().map((n) => (n.id === id ? updatedNote : n));
              patchState(store, { notes });
            }),
            catchError((error) => {
              patchState(store, {
                error: error.message || 'Failed to toggle archive',
              });
              return of(null);
            }),
          );
        }),
      ),
    ),

    clearError(): void {
      patchState(store, { error: null });
    },

    reset(): void {
      patchState(store, initialState);
    },
  })),

  withHooks({
    onInit(store) {
      store.loadNotes();
    },
  }),
);
