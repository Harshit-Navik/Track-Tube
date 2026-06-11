const PLAYLIST_KEY_PREFIX = "progressTube:playlist:";

export const playlistStorageKey = (playlistId: string): string =>
  `${PLAYLIST_KEY_PREFIX}${playlistId}`;

export const playlistIdFromStorageKey = (key: string): string | null =>
  key.startsWith(PLAYLIST_KEY_PREFIX) ? key.slice(PLAYLIST_KEY_PREFIX.length) : null;
