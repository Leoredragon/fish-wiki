type SupabaseImageOptions = {
  width?: number;
  quality?: number;
};

/**
 * Convert Supabase public object URL into resized render URL.
 * This reduces bandwidth by serving right-sized images from Storage.
 */
export function getOptimizedSupabaseImageUrl(
  url?: string | null,
  options: SupabaseImageOptions = {}
): string {
  if (!url) return '';

  const { width = 640, quality = 78 } = options;
  const marker = '/storage/v1/object/public/';
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) return url;

  const prefix = url.slice(0, markerIndex);
  const objectPath = url.slice(markerIndex + marker.length);
  const encodedPath = objectPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${prefix}/storage/v1/render/image/public/${encodedPath}?width=${width}&quality=${quality}`;
}
