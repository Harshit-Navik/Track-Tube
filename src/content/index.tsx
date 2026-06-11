import { createRoot } from "react-dom/client";
import { NavigationObserver } from "../observers/NavigationObserver";
import { PlaylistObserver } from "../observers/PlaylistObserver";
import { VideoElementObserver } from "../observers/VideoElementObserver";
import { storageService } from "../storage/ChromeStorageService";
import { logError } from "../utils/logger";
import "../styles/content.css";
import { getPlaylistId } from "../youtube/url";
import { removeAllMounts } from "../youtube/mountPoints";
import { ContentApp } from "./ContentApp";
import { portalRegistry } from "./portalRegistry";

const host = document.createElement("div");
host.id = "progress-tube-root";
document.documentElement.append(host);

const root = createRoot(host);
root.render(<ContentApp />);

let playlistObserver: PlaylistObserver | null = null;

const handleNavigation = (url: string): void => {
  playlistObserver?.stop();
  playlistObserver = null;
  portalRegistry.clear();
  removeAllMounts();

  const playlistId = getPlaylistId(url);
  if (!playlistId) return;
  void storageService.hydrate(playlistId).catch((error: unknown) => {
    logError("Failed to hydrate playlist", error);
  });
  playlistObserver = new PlaylistObserver(playlistId);
  playlistObserver.start();
};

const navigationObserver = new NavigationObserver(handleNavigation);
const videoObserver = new VideoElementObserver();
navigationObserver.start();
videoObserver.start();

window.addEventListener(
  "pagehide",
  () => {
    playlistObserver?.stop();
    navigationObserver.stop();
    videoObserver.stop();
    storageService.dispose();
    root.unmount();
    host.remove();
  },
  { once: true },
);
