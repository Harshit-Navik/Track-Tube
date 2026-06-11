import { YOUTUBE_SELECTORS } from "./selectors";

export const getDeclaredPlaylistTotal = (): number | undefined => {
  const regions = document.querySelectorAll<HTMLElement>(YOUTUBE_SELECTORS.playlistHeaderRegion);
  for (const region of regions) {
    const match = region.innerText.match(/\b([\d,]+)\s+videos?\b/i);
    if (!match?.[1]) continue;
    const total = Number.parseInt(match[1].replaceAll(",", ""), 10);
    if (Number.isFinite(total)) return total;
  }
  return undefined;
};
