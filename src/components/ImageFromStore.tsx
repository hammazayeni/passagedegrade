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
      const out = await resolveImageSrc(src);
      if (cancelled) return;
      const isIdb = src.startsWith('idb:');
      const finalSrc = out || (isIdb ? fallback : src);
      setResolved(finalSrc);
      if (out && out.startsWith('blob:')) revokeUrl = out;
    };
    run();
    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [src]);

  return <img src={resolved || src || fallback} {...rest} />;
}
