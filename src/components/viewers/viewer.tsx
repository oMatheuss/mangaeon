'use client';

import { Activity } from 'react';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { PageByPageView } from '@/components/viewers/page-by-page-view';
import { InfiniteScrollerView } from '@/components/viewers/infinite-scroller-view';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ViewerProps {
  images: string[];
}

export function Viewer({ images }: ViewerProps) {
  const [view, setView] = usePersistedState('infinite-scroller', 'viewer-type');

  return (
    <>
      <div className='mb-3 flex w-full justify-start'>
        <Select value={view} onValueChange={setView}>
          <SelectTrigger>
            <SelectValue placeholder='Select a viewer' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='infinite-scroller'>Rolagem</SelectItem>
            <SelectItem value='page-by-page'>Por Página</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Activity mode={view === 'page-by-page' ? 'visible' : 'hidden'}>
        <PageByPageView images={images} />
      </Activity>
      <Activity mode={view === 'infinite-scroller' ? 'visible' : 'hidden'}>
        <InfiniteScrollerView images={images} />
      </Activity>
    </>
  );
}
