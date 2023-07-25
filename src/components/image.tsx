import { useState } from 'react';

interface ImageProps {
  source: [src: string, type: string];
  src: string;
  alt: string;
  className: string;
  children: React.ReactNode;
}

export const Image = ({
  source,
  src,
  alt,
  className,
  children,
}: ImageProps) => {
  const [isErrored, setIsErrored] = useState(false);
  const handleError = () => setIsErrored(true);

  if (isErrored) return children;

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
