export const YOUTUBE_SELECTORS = {
  playlistItem: "ytd-playlist-video-renderer, ytd-playlist-panel-video-renderer",
  playlistItemLink: "a[href*='watch'][href*='v=']",
  playlistItemMetadata: "#meta, .meta",
  playlistHeader:
    "ytd-playlist-header-renderer #stats, ytd-playlist-panel-renderer #header-description",
  playlistHeaderRegion: "ytd-playlist-header-renderer, ytd-playlist-panel-renderer",
  playlistContainer: "ytd-playlist-video-list-renderer, ytd-playlist-panel-renderer",
  video: "video.html5-main-video",
} as const;
