import type { PortalTarget } from "../types/youtube";

type Listener = () => void;

class PortalRegistry {
  private readonly targets = new Map<string, PortalTarget>();
  private readonly listeners = new Set<Listener>();
  private snapshot: PortalTarget[] = [];

  getSnapshot = (): PortalTarget[] => this.snapshot;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  upsert(target: PortalTarget): void {
    const existing = this.targets.get(target.key);
    if (
      existing?.element === target.element &&
      existing.element.isConnected &&
      existing.rowElement === target.rowElement &&
      existing.totalVideos === target.totalVideos
    ) {
      return;
    }
    this.targets.set(target.key, target);
    this.publish();
  }

  reconcile(playlistId: string): void {
    let changed = false;
    for (const [key, target] of this.targets) {
      if (target.playlistId !== playlistId || !target.element.isConnected) {
        this.targets.delete(key);
        changed = true;
      }
    }
    if (changed) this.publish();
  }

  clear(): void {
    if (this.targets.size === 0) return;
    this.targets.clear();
    this.publish();
  }

  private publish(): void {
    this.snapshot = [...this.targets.values()];
    this.listeners.forEach((listener) => listener());
  }
}

export const portalRegistry = new PortalRegistry();
