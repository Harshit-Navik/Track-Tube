import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { storageService } from "../storage/ChromeStorageService";
import { createPlaylistState } from "../types/state";
import type { PlaylistState } from "../types/state";
import { logError } from "../utils/logger";

export const usePlaylistState = (playlistId: string): PlaylistState => {
  const emptyState = useMemo(() => createPlaylistState(playlistId), [playlistId]);

  useEffect(() => {
    void storageService
      .hydrate(playlistId)
      .catch((error: unknown) => logError("Failed to hydrate playlist", error));
  }, [playlistId]);

  const subscribe = useCallback(
    (listener: () => void) => storageService.subscribe(playlistId, listener),
    [playlistId],
  );
  const getSnapshot = useCallback(
    () => storageService.get(playlistId) ?? emptyState,
    [emptyState, playlistId],
  );

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
  );
};
