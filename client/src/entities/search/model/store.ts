import { createEvent, createStore, restore } from 'effector';
import { debounce } from 'patronum';

import { SEARCH_DEBOUNCE } from '@/shared/constants';


export const searchQueryUpdated = createEvent<string>('setSearchQuery');
export const $searchQuery = restore(searchQueryUpdated, '');
export const searchDebounce = debounce({ source: searchQueryUpdated, timeout: SEARCH_DEBOUNCE });

export const searchQueryReseted = createEvent();
$searchQuery.on(searchQueryReseted, () => '');

// Define events and store
export const noMoreReceived = createEvent();
export const hasMoreReceived = createEvent();
export const $hasMore = createStore(true);

// Set the boolean value to the $hasMore store when events occur
$hasMore
  .on(noMoreReceived, () => false) // Set to false when noMoreReceived event occurs
  .on(hasMoreReceived, () => true); // Set to true when hasMoreReceived event occurs

// TODO
// export const $error = createStore<Record<string, null | Error>>({ error: null });
// export const setError = createEvent<Error>('setError');
// $error
//   .on(setError, (_, error) => ({ error }));
