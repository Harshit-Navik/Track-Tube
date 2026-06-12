import { createPlaylistState, createVideoState } from "../types/state";
import type { PlaylistState, VideoState, VideoStatePatch } from "../types/state";
import type { PlaylistListener, StorageService } from "./StorageService";
import { playlistIdFromStorageKey, playlistStorageKey } from "./storageKeys";

const clampProgress = (value: number): number => Math.min(1, Math.max(0, value));

const isVideoState = (value: unknown): value is VideoState => {
  if (!value || typeof value !== "object") return false;
  const video = value as Partial<VideoState>;
  return (
    typeof video.videoId === "string" &&
    typeof video.completed === "boolean" &&
    typeof video.important === "boolean" &&
    typeof video.revisit === "boolean" &&
    typeof video.watchProgress === "number" &&
    typeof video.updatedAt === "number"
  );
};

const normalizePlaylist = (playlistId: string, value: unknown): PlaylistState => {
  if (!value || typeof value !== "object") return createPlaylistState(playlistId);
  const candidate = value as Partial<PlaylistState>;
  const videos: Record<string, VideoState> = {};

  if (candidate.videos && typeof candidate.videos === "object") {
    for (const [videoId, video] of Object.entries(candidate.videos)) {
      if (isVideoState(video) && video.videoId === videoId) {
        videos[videoId] = { ...video, watchProgress: clampProgress(video.watchProgress) };
      }
    }
  }

  return { playlistId, videos };
};

export class ChromeStorageService implements StorageService {
  private readonly cache = new Map<string, PlaylistState>();
  private readonly listeners = new Map<string, Set<PlaylistListener>>();
  private readonly queues = new Map<string, Promise<unknown>>();
  private readonly hydrationPromises = new Map<string, Promise<PlaylistState>>();

  constructor() {
    chrome.storage.onChanged.addListener(this.handleStorageChange);
  }

  get(playlistId: string): PlaylistState | undefined {
    return this.cache.get(playlistId);
  }

  async hydrate(playlistId: string): Promise<PlaylistState> {
    const cached = this.cache.get(playlistId);
    if (cached) return cached;

    const pending = this.hydrationPromises.get(playlistId);
    if (pending) return pending;

    const hydration = (async () => {
      const key = playlistStorageKey(playlistId);
      const result = await chrome.storage.local.get(key);
      const state = this.cache.get(playlistId) ?? normalizePlaylist(playlistId, result[key]);
      this.cache.set(playlistId, state);
      this.emit(playlistId);
      return state;
    })();
    this.hydrationPromises.set(playlistId, hydration);

    try {
      return await hydration;
    } finally {
      if (this.hydrationPromises.get(playlistId) === hydration) {
        this.hydrationPromises.delete(playlistId);
      }
    }
  }

  async set(state: PlaylistState): Promise<void> {
    const normalized = normalizePlaylist(state.playlistId, state);
    await chrome.storage.local.set({ [playlistStorageKey(normalized.playlistId)]: normalized });
    this.cache.set(normalized.playlistId, normalized);
    this.emit(normalized.playlistId);
  }

  update(playlistId: string, videoId: string, patch: VideoStatePatch): Promise<PlaylistState> {
    const previous = this.queues.get(playlistId) ?? Promise.resolve();
    const operation = previous.then(async () => {
      const playlist = await this.hydrate(playlistId);
      const current = playlist.videos[videoId] ?? createVideoState(videoId);
      const nextProgress =
        patch.watchProgress === undefined
          ? current.watchProgress
          : Math.max(current.watchProgress, clampProgress(patch.watchProgress));
      const nextVideo: VideoState = {
        ...current,
        ...patch,
        videoId,
        watchProgress: nextProgress,
        updatedAt: Date.now(),
      };
      const nextPlaylist: PlaylistState = {
        playlistId,
        videos: { ...playlist.videos, [videoId]: nextVideo },
      };
      await this.set(nextPlaylist);
      return nextPlaylist;
    });

    const queued = operation
      .catch(() => undefined)
      .finally(() => {
        if (this.queues.get(playlistId) === queued) this.queues.delete(playlistId);
      });
    this.queues.set(playlistId, queued);
    return operation;
  }

  subscribe(playlistId: string, listener: PlaylistListener): () => void {
    const playlistListeners = this.listeners.get(playlistId) ?? new Set<PlaylistListener>();
    playlistListeners.add(listener);
    this.listeners.set(playlistId, playlistListeners);
    return () => {
      playlistListeners.delete(listener);
      if (playlistListeners.size === 0) this.listeners.delete(playlistId);
    };
  }

  dispose(): void {
    chrome.storage.onChanged.removeListener(this.handleStorageChange);
    this.listeners.clear();
    this.cache.clear();
    this.queues.clear();
    this.hydrationPromises.clear();
  }

  private readonly handleStorageChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ): void => {
    if (areaName !== "local") return;
    for (const [key, change] of Object.entries(changes)) {
      const playlistId = playlistIdFromStorageKey(key);
      if (!playlistId) continue;
      this.cache.set(playlistId, normalizePlaylist(playlistId, change.newValue));
      this.emit(playlistId);
    }
  };

  private emit(playlistId: string): void {
    this.listeners.get(playlistId)?.forEach((listener) => listener());
  }
}

export const storageService = new ChromeStorageService();
