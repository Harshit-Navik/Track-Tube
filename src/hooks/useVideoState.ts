import { useCallback } from "react";
import { storageService } from "../storage/ChromeStorageService";
import { createVideoState } from "../types/state";
import type { VideoState, VideoStatePatch } from "../types/state";
import { usePlaylistState } from "./usePlaylistState";

export const useVideoState = (
  playlistId: string,
  videoId: string,
): [VideoState, (patch: VideoStatePatch) => Promise<void>] => {
  const playlist = usePlaylistState(playlistId);
  const video = playlist.videos[videoId] ?? createVideoState(videoId);
  const update = useCallback(
    async (patch: VideoStatePatch) => {
      await storageService.update(playlistId, videoId, patch);
    },
    [playlistId, videoId],
  );
  return [video, update];
};
