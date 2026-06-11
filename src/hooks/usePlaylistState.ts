import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { storageService } from "../storage/ChromeStorageService";
import { createPlaylistState } from "../types/state";
import type { PlaylistState } from "../types/state";

export const usePlaylistState = (playlistId: string): PlaylistState => {
  const emptyState = useMemo(() => createPlaylistState(playlistId), [playlistId]);

  useEffect(() => {
    void storageService.hydrate(playlistId);
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
