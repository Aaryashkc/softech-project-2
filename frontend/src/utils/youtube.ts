const DIRECT_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export const extractYouTubeVideoId = (input?: string | null): string | null => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (DIRECT_ID_REGEX.test(trimmed)) {
    return trimmed;
  }

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    const host = url.hostname.replace('www.', '');

    if (!['youtube.com', 'youtu.be', 'm.youtube.com'].includes(host)) {
      return null;
    }

    if (host === 'youtu.be') {
      const pathId = url.pathname.replace('/', '').split('/')[0];
      return pathId || null;
    }

    if (url.searchParams.has('v')) {
      return url.searchParams.get('v');
    }

    const pathPatterns = [/^\/embed\/([^/?]+)/, /^\/shorts\/([^/?]+)/, /^\/live\/([^/?]+)/];
    for (const pattern of pathPatterns) {
      const match = url.pathname.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const getYouTubeEmbedUrl = (input?: string | null): string | null => {
  const videoId = extractYouTubeVideoId(input);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

