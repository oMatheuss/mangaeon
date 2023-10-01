'use client';

import { useViewed } from '@/lib/client/viewed';
import { BookOpenCheck, LucideProps } from 'lucide-react';

interface ViewedIconProps extends LucideProps {
  chapterId: string;
}

export const ViewedIcon = ({ chapterId, ...rest }: ViewedIconProps) => {
  const { exist } = useViewed();

  if (!exist(chapterId)) {
    return null;
  }

  return <BookOpenCheck {...rest} />;
};
