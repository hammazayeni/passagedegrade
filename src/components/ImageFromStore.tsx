import React from 'react';
import { resolveImageSrc } from '@/lib/imageStore';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string };

export function ImageFromStore({ src, ...rest }: Props) {
  const [resolved, setResolved] = React.useState<string>('');
  const fallback = `${import.meta.env.BASE_URL}assets/default-avatar_variant_2.png`;

  React.useEffect(() => {
    let revokeUrl: string | null = null;
    let cancelled = false;
    const run = async () => {
      const baseSrc = src && src.trim().length > 0 ? src : fallback;
      if (/^https?:\/\//.test(baseSrc)) {
        setResolved(baseSrc);
        return;
      }
      const out = await resolveImageSrc(baseSrc);
      if (cancelled) return;
      const isIdb = baseSrc.startsWith('idb:');
      const finalSrc = out || (isIdb ? fallback : baseSrc);
      setResolved(finalSrc);
      if (out && out.startsWith('blob:')) revokeUrl = out;
    };
    run();
    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [src]);

  return (
    <img
      src={resolved || src || fallback}
      onError={(e) => {
        const el = e.currentTarget as HTMLImageElement;
        if (el.src !== fallback) el.src = fallback;
      }}
      {...rest}
    />
  );
}
