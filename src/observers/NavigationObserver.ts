type NavigationListener = (url: string) => void;

export class NavigationObserver {
  private lastUrl = window.location.href;
  private observer: MutationObserver | null = null;

  constructor(private readonly listener: NavigationListener) {}

  start(): void {
    document.addEventListener("yt-navigate-finish", this.handlePotentialNavigation);
    window.addEventListener("popstate", this.handlePotentialNavigation);
    this.observer = new MutationObserver(this.handlePotentialNavigation);
    this.observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    this.listener(this.lastUrl);
  }

  stop(): void {
    document.removeEventListener("yt-navigate-finish", this.handlePotentialNavigation);
    window.removeEventListener("popstate", this.handlePotentialNavigation);
    this.observer?.disconnect();
    this.observer = null;
  }

  private readonly handlePotentialNavigation = (): void => {
    const nextUrl = window.location.href;
    if (nextUrl === this.lastUrl) return;
    this.lastUrl = nextUrl;
    this.listener(nextUrl);
  };
}
