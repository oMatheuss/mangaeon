'use client';

import dynamic from 'next/dynamic';
import { usePersistedState } from '@/hooks/use-persisted-state';

interface ViewerProps {
  images: string[];
}

const PageByPageView = dynamic(
  () => import('@/components/viewers/page-by-page-view'),
  { ssr: false }
);

const InfiniteScrollerView = dynamic(
  () => import('@/components/viewers/infinite-scroller-view'),
  { ssr: false }
);

const ViewSelector = dynamic(
  () => import('@/components/viewers/view-selector'),
  { ssr: false }
);

export function Viewer({ images }: ViewerProps) {
  const [view, setView] = usePersistedState('infinite-scroller', 'viewer-type');

  const Viewer =
    view === 'page-by-page' ? PageByPageView : InfiniteScrollerView;

  return (
    <>
      <ViewSelector value={view} onChange={setView}>
        <option value='infinite-scroller'>Rolagem</option>
        <option value='page-by-page'>Por Página</option>
      </ViewSelector>
      <Viewer images={images} />
    </>
  );
}
