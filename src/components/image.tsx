import ImageOff from '/image-off.svg';
import { useState } from 'react';

interface ImageProps {
  source: [src: string, type: string];
  src: string;
  alt: string;
  className: string;
}

export const Image = ({ source, src, alt, className }: ImageProps) => {
  const [isErrored, setIsErrored] = useState(false);
  const handleError = () => setIsErrored(true);

  if (isErrored) {
    return <img src={ImageOff} alt={alt} className={'p-4 ' + className} />;
  }

  return (
    <picture>
      <source srcSet={source[0]} type={source[1]} />
      <img
        loading='lazy'
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
      />
    </picture>
  );
};
