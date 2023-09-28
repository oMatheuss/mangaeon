'use client';

import { useState } from 'react';

interface ImageProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    'src' | 'onError' | 'children'
  > {
  sources: { src: string; type: string }[][];
  fallback: React.ReactNode;
}

export const Image = ({ sources, fallback, alt, ...props }: ImageProps) => {
  const [imageGroup, setImageGroup] = useState(0);
  const [isErrored, setIsErrored] = useState(false);
  const handleError = () => {
    const newIdx = imageGroup + 1;
    if (newIdx < sources.length) setImageGroup(newIdx);
    else setIsErrored(true);
  };

  if (isErrored) return fallback;

  const arr = [...sources[imageGroup]];
  const last = arr.pop()!;

  return (
    <picture>
      {arr.map((v, i) => (
        <source key={i} srcSet={v.src} type={v.type} />
      ))}
      <img
        {...props}
        key={`${last.src}/${imageGroup}`}
        src={last.src}
        alt={alt || ''}
        onError={handleError}
      />
    </picture>
  );
};
