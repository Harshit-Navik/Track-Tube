import { YOUTUBE_SELECTORS } from "./selectors";
import { getVideoId } from "./url";

export const isPlaylistItem = (element: Element): boolean =>
  element.matches(YOUTUBE_SELECTORS.playlistItem);

export const findPlaylistItems = (root: ParentNode): Element[] => {
  const elements: Element[] = [];
  if (root instanceof Element && isPlaylistItem(root)) elements.push(root);
  elements.push(...root.querySelectorAll(YOUTUBE_SELECTORS.playlistItem));
  return elements;
};

export const getPlaylistItemVideoId = (item: Element): string | null => {
  const link = item.querySelector<HTMLAnchorElement>(YOUTUBE_SELECTORS.playlistItemLink);
  return link ? getVideoId(link.href) : null;
};
