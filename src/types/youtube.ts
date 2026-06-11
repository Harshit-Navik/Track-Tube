export interface PortalTarget {
  key: string;
  kind: "stats" | "video";
  element: HTMLElement;
  rowElement?: HTMLElement;
  playlistId: string;
  videoId?: string;
  totalVideos?: number;
}
