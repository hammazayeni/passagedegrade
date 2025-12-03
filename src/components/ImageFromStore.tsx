import React from 'react';
import { resolveImageSrc } from '@/lib/imageStore';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string };

export function ImageFromStore({ src, ...rest }: Props) {
  const [resolved, setResolved] = React.useState<string>('');

  React.useEffect(() => {
    let revokeUrl: string | null = null;
    let cancelled = false;
    const run = async () => {
      const out = await resolveImageSrc(src);
      if (cancelled) return;
      setResolved(out || src);
      if (out && out.startsWith('blob:')) revokeUrl = out;
    };
    run();
    return () => {
      cancelled = true;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [src]);

  return <img src={resolved || src} {...rest} />;
}

