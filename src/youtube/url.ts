const getUrl = (input: string = window.location.href): URL | null => {
  try {
    return new URL(input, window.location.origin);
  } catch {
    return null;
  }
};

export const getPlaylistId = (input?: string): string | null =>
  getUrl(input)?.searchParams.get("list") || null;

export const getVideoId = (input?: string): string | null =>
  getUrl(input)?.searchParams.get("v") || null;
