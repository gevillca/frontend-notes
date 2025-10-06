/**
 * Query parameter keys used across the application
 */
export const QUERY_PARAMS = {
  SEARCH: 'search',
  TAG: 'tag',
} as const;

/**
 * Search configuration constants
 */
export const SEARCH_CONFIG = {
  DEBOUNCE_TIME: 300,
  MIN_SEARCH_LENGTH: 0,
  PLACEHOLDER_DEFAULT: 'Search...',
  PLACEHOLDER_NOTES: 'Search by title, content, or tags...',
} as const;
