'use client';

import { useState } from 'react';
import { Select } from '../select';
import { InfiniteScrollerView } from './infinite-scroller-view';
import { PageByPageView } from './page-by-page-view';

interface ViewerProps {
  images: string[];
}

export function Viewer({ images }: ViewerProps) {
  const [viewerType, setViewerType] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('viewer-type') ?? '';
    } else return '';
  });

  const Viewer =
    viewerType === 'page-by-page' ? PageByPageView : InfiniteScrollerView;

  return (
    <>
      <Select
        value={viewerType}
        onChange={(value) => {
          setViewerType(value);
          localStorage.setItem('viewer-type', value);
        }}
      >
        <option value='page-by-page'>Por Página</option>
        <option value='infinite-scroller'>Rolagem</option>
      </Select>
      <Viewer images={images} />
    </>
  );
}
