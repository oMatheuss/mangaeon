'use client';

import { AddViewed } from '@/components/add-viewed';
import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { Images } from '@/types/images';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export default function Leitor() {
  const pathname = usePathname();
  const id = pathname.split('/').pop() ?? '';

  const pagesQuery = useQuery({
    queryKey: ['ler', id],
    queryFn: async () =>
      (await fetch(`/api/chapter/${id}`).then((d) => d.json())) as Images,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const images = pagesQuery.data?.srcs ?? [];

  return (
    <div className='flex flex-col items-center mb-3'>
      <AddViewed id={id} />
      <Paginas images={images} />
      <CommentSection chapterId={id} />
    </div>
  );
}
