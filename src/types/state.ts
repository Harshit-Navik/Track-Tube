export interface VideoState {
  videoId: string;
  completed: boolean;
  important: boolean;
  revisit: boolean;
  watchProgress: number;
  updatedAt: number;
}

export interface PlaylistState {
  playlistId: string;
  videos: Record<string, VideoState>;
}

export type VideoStatePatch = Partial<
  Pick<VideoState, "completed" | "important" | "revisit" | "watchProgress">
>;

export const createVideoState = (videoId: string): VideoState => ({
  videoId,
  completed: false,
  important: false,
  revisit: false,
  watchProgress: 0,
  updatedAt: 0,
});

export const createPlaylistState = (playlistId: string): PlaylistState => ({
  playlistId,
  videos: {},
});
