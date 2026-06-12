const getUrl = (input: string = window.location.href): URL | null => {
  try {
    return new URL(input, window.location.origin);
  } catch {
    return null;
  }
};

const isYouTubeId = (value: string | null): value is string =>
  !!value && value.length <= 128 && /^[\w-]+$/.test(value);

export const getPlaylistId = (input?: string): string | null => {
  const playlistId = getUrl(input)?.searchParams.get("list") ?? null;
  return isYouTubeId(playlistId) ? playlistId : null;
};

export const getVideoId = (input?: string): string | null => {
  const videoId = getUrl(input)?.searchParams.get("v") ?? null;
  return isYouTubeId(videoId) ? videoId : null;
};
