'use client';

import { useViewed } from '@/lib/client/viewed';
import { useEffect } from 'react';

export const AddViewed = ({ id }: { id: string }) => {
  const { add } = useViewed();

  useEffect(() => {
    add(id);
  }, [add, id]);

  return null;
};
