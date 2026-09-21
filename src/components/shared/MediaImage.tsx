import type { MediaDto } from "@/lib/contracts";
import { mediaUrl } from "@/lib/media-url";

interface Props {
  media: MediaDto;
  className?: string;
  eager?: boolean;
}

export function MediaImage({ media, className, eager = false }: Props) {
  const src = mediaUrl(media);
  if (!src) return null;

  return (
    <img
      className={className}
      src={src}
      alt={media.isDecorative ? "" : media.alt || media.title || ""}
      width={media.width || undefined}
      height={media.height || undefined}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
    />
  );
}
