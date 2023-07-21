import { useViewed } from '@/lib/viewed';
import { BookOpenCheck, LucideProps } from 'lucide-react';

interface ViewedIconProps extends LucideProps {
  id_chapter: number;
}

export const ViewedIcon = ({ id_chapter, ...rest }: ViewedIconProps) => {
  const { exist } = useViewed();

  if (!exist(id_chapter)) {
    return null;
  }

  return <BookOpenCheck {...rest} />;
};
