import { storageService } from "../storage/ChromeStorageService";
import { logError } from "../utils/logger";
import { YOUTUBE_SELECTORS } from "../youtube/selectors";
import { getPlaylistId, getVideoId } from "../youtube/url";

const WRITE_STEP = 0.01;

export class VideoElementObserver {
  private observer: MutationObserver | null = null;
  private video: HTMLVideoElement | null = null;
  private lastSavedProgress = 0;
  private completed = false;
  private trackedKey = "";

  start(): void {
    this.connectVideo();
    this.observer = new MutationObserver(() => this.connectVideo());
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.disconnectVideo();
  }

  private connectVideo(): void {
    const nextVideo = document.querySelector<HTMLVideoElement>(YOUTUBE_SELECTORS.video);
    if (nextVideo === this.video) return;
    this.disconnectVideo();
    this.video = nextVideo;
    if (!this.video) return;
    this.lastSavedProgress = 0;
    this.completed = false;
    for (const event of ["timeupdate", "seeked", "loadedmetadata", "durationchange", "ended"]) {
      this.video.addEventListener(event, this.handleProgress);
    }
    this.handleProgress();
  }

  private disconnectVideo(): void {
    if (!this.video) return;
    for (const event of ["timeupdate", "seeked", "loadedmetadata", "durationchange", "ended"]) {
      this.video.removeEventListener(event, this.handleProgress);
    }
    this.video = null;
    this.trackedKey = "";
  }

  private readonly handleProgress = (): void => {
    if (!this.video || !Number.isFinite(this.video.duration) || this.video.duration <= 0) return;
    const playlistId = getPlaylistId();
    const videoId = getVideoId();
    if (!playlistId || !videoId) return;
    const trackedKey = `${playlistId}:${videoId}`;
    if (trackedKey !== this.trackedKey) {
      this.trackedKey = trackedKey;
      this.lastSavedProgress = 0;
      this.completed = false;
    }

    const progress = Math.min(1, this.video.currentTime / this.video.duration);
    const shouldComplete = progress >= 0.9;
    if (!shouldComplete && progress - this.lastSavedProgress < WRITE_STEP) return;
    if (shouldComplete && this.completed && progress - this.lastSavedProgress < WRITE_STEP) return;

    this.lastSavedProgress = Math.max(this.lastSavedProgress, progress);
    this.completed ||= shouldComplete;
    void storageService
      .update(playlistId, videoId, {
        watchProgress: progress,
        ...(shouldComplete ? { completed: true } : {}),
      })
      .catch((error: unknown) => logError("Failed to save progress", error));
  };
}
