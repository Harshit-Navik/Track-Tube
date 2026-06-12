import type { PortalTarget } from "../types/youtube";
import { getDeclaredPlaylistTotal } from "./playlistMetadata";
import { YOUTUBE_SELECTORS } from "./selectors";
import { getPlaylistItemIndex, getPlaylistItemVideoId } from "./playlistItems";

const MOUNT_CLASS = "progress-tube-mount";
const ROW_ID_DATASET_KEY = "progressTubeRowId";
let nextRowId = 0;

export const ensureVideoMount = (item: Element, playlistId: string): PortalTarget | null => {
  const videoId = getPlaylistItemVideoId(item);
  if (!videoId || !(item instanceof HTMLElement)) return null;

  const existing = item.querySelector<HTMLElement>(
    `.${MOUNT_CLASS}[data-progress-tube-kind="video"]`,
  );
  const element = existing ?? document.createElement("div");
  element.className = `${MOUNT_CLASS} progress-tube-video-mount`;
  element.dataset.progressTubeKind = "video";
  element.dataset.progressTubeVideoId = videoId;
  element.dataset.progressTubePlaylistId = playlistId;
  const itemIndex = getPlaylistItemIndex(item);
  const rowId =
    itemIndex ??
    item.dataset[ROW_ID_DATASET_KEY] ??
    String((nextRowId += 1));
  item.dataset[ROW_ID_DATASET_KEY] = rowId;
  if (itemIndex) element.dataset.progressTubeItemIndex = itemIndex;
  else delete element.dataset.progressTubeItemIndex;
  if (!existing) {
    item.append(element);
  }

  return {
    key: `video:${playlistId}:${rowId}:${videoId}`,
    kind: "video",
    element,
    rowElement: item,
    playlistId,
    videoId,
  };
};

export const ensureStatsMount = (playlistId: string): PortalTarget | null => {
  const container =
    document.querySelector<HTMLElement>(YOUTUBE_SELECTORS.playlistHeader) ??
    document.querySelector<HTMLElement>(YOUTUBE_SELECTORS.playlistContainer);
  if (!container) return null;

  const existing = container.querySelector<HTMLElement>(
    `:scope > .${MOUNT_CLASS}[data-progress-tube-kind="stats"]`,
  );
  const element = existing ?? document.createElement("div");
  element.className = `${MOUNT_CLASS} progress-tube-stats-mount`;
  element.dataset.progressTubeKind = "stats";
  element.dataset.progressTubePlaylistId = playlistId;
  if (!existing) container.prepend(element);

  const totalVideos = getDeclaredPlaylistTotal();
  return {
    key: `stats:${playlistId}`,
    kind: "stats",
    element,
    playlistId,
    ...(totalVideos === undefined ? {} : { totalVideos }),
  };
};

export const removeAllMounts = (): void => {
  document.querySelectorAll(`.${MOUNT_CLASS}`).forEach((element) => element.remove());
};
