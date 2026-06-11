import type { PlaylistState, VideoStatePatch } from "../types/state";

export type PlaylistListener = () => void;

export interface StorageService {
  get(playlistId: string): PlaylistState | undefined;
  hydrate(playlistId: string): Promise<PlaylistState>;
  set(state: PlaylistState): Promise<void>;
  update(playlistId: string, videoId: string, patch: VideoStatePatch): Promise<PlaylistState>;
  subscribe(playlistId: string, listener: PlaylistListener): () => void;
  dispose(): void;
}
