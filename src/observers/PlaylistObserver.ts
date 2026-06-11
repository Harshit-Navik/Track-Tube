import { portalRegistry } from "../content/portalRegistry";
import { findPlaylistItems } from "../youtube/playlistItems";
import { ensureStatsMount, ensureVideoMount } from "../youtube/mountPoints";

export class PlaylistObserver {
  private observer: MutationObserver | null = null;
  private scheduled = false;
  private readonly pendingRoots = new Set<ParentNode>();

  constructor(private readonly playlistId: string) {}

  start(): void {
    this.processRoot(document);
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) this.pendingRoots.add(node);
        });
      }
      this.scheduleProcessing();
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.pendingRoots.clear();
    this.scheduled = false;
  }

  private scheduleProcessing(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.requestAnimationFrame(() => {
      this.scheduled = false;
      for (const root of this.pendingRoots) this.processRoot(root);
      this.pendingRoots.clear();
      this.ensureStats();
      portalRegistry.reconcile(this.playlistId);
    });
  }

  private processRoot(root: ParentNode): void {
    for (const item of findPlaylistItems(root)) {
      const target = ensureVideoMount(item, this.playlistId);
      if (target) portalRegistry.upsert(target);
    }
    this.ensureStats();
  }

  private ensureStats(): void {
    const target = ensureStatsMount(this.playlistId);
    if (target) portalRegistry.upsert(target);
  }
}
