import { computed, effect, inject } from '@angular/core';
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

import { AuthService } from '@features/auth/services/auth.service';

import { Tag } from '../interfaces/tag.interface';
import { TagsService } from '../services/tags.service';

interface TagsState {
  tags: Tag[];
  selectedTag: Tag | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: TagsState = {
  tags: [],
  selectedTag: null,
  isLoading: false,
  error: null,
  searchTerm: '',
};

export const TagsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    filteredTags: computed(() => {
      const tags = store.tags();
      const searchTerm = store.searchTerm().toLowerCase();

      if (!searchTerm) {
        return tags;
      }

      return tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm));
    }),

    sortedTags: computed(() => {
      return [...store.tags()].sort((a, b) => a.name.localeCompare(b.name));
    }),

    tagCount: computed(() => store.tags().length),

    /**
     * Returns function to lookup tag by ID (returns null if not found)
     */
    getTagById: computed(() => (id: string) => {
      return store.tags().find((tag) => tag.id === id) || null;
    }),

    /**
     * Returns function to get tag name by ID (returns 'Unknown' if not found)
     */
    getTagName: computed(() => (id: string) => {
      const tag = store.tags().find((t) => t.id === id);
      return tag?.name || 'Unknown';
    }),
  })),

  withMethods((store, tagsService = inject(TagsService)) => ({
    loadTags: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          tagsService.getAllTags().pipe(
            tap((tags) =>
              patchState(store, {
                tags,
                isLoading: false,
                error: null,
              }),
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load tags',
              });
              return of([]);
            }),
          ),
        ),
      ),
    ),

    loadTagById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          tagsService.getTagById(id).pipe(
            tap((tag) =>
              patchState(store, {
                selectedTag: tag,
                isLoading: false,
                error: null,
              }),
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to load tag',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    createTag: rxMethod<Partial<Tag>>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((tag) =>
          tagsService.createTag(tag).pipe(
            tap((newTag) =>
              patchState(store, {
                tags: [...store.tags(), newTag],
                isLoading: false,
                error: null,
              }),
            ),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to create tag',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    updateTag: rxMethod<{ id: string; tag: Partial<Tag> }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ id, tag }) =>
          tagsService.updateTag(id, tag).pipe(
            tap((updatedTag) => {
              const tags = store.tags().map((t) => (t.id === id ? updatedTag : t));
              patchState(store, {
                tags,
                selectedTag: store.selectedTag()?.id === id ? updatedTag : store.selectedTag(),
                isLoading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to update tag',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    deleteTag: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          tagsService.deleteTag(id).pipe(
            tap(() => {
              const tags = store.tags().filter((t) => t.id !== id);
              patchState(store, {
                tags,
                selectedTag: store.selectedTag()?.id === id ? null : store.selectedTag(),
                isLoading: false,
                error: null,
              });
            }),
            catchError((error) => {
              patchState(store, {
                isLoading: false,
                error: error.message || 'Failed to delete tag',
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
    searchTags: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchTerm) => patchState(store, { searchTerm })),
      ),
    ),

    setSelectedTag(tag: Tag | null): void {
      patchState(store, { selectedTag: tag });
    },

    clearError(): void {
      patchState(store, { error: null });
    },

    reset(): void {
      patchState(store, initialState);
    },
  })),

  withHooks({
    onInit(store, authService = inject(AuthService)) {
      store.loadTags();

      effect(() => {
        const authStatus = authService.authStatus();
        if (authStatus === 'authenticated') store.loadTags();
        if (authStatus === 'not-authenticated') store.reset();
      });
    },
  }),
);
