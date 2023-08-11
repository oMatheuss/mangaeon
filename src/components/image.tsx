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

export const Image = ({ sources, fallback, ...props }: ImageProps) => {
  const [imageGroup, setImageGroup] = useState(0);
  const [isErrored, setIsErrored] = useState(false);
  const handleError = () => {
    let newIdx = imageGroup + 1;
    if (newIdx < sources.length) setImageGroup(newIdx);
    else setIsErrored(true);
  };

  if (isErrored) return fallback;

  return (
    <picture>
      {sources[imageGroup].map((v, i) => (
        <source key={i} srcSet={v.src} type={v.type} />
      ))}
      <img
        {...props}
        src={sources[imageGroup][sources.length - 1].src}
        onError={handleError}
      />
    </picture>
  );
};
