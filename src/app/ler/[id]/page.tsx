'use client';

import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import { useViewed } from '@/lib/viewed';
import { ImagesResponse } from '@/types/images';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const fetchImagesLinks = async (id: string): Promise<ImagesResponse> => {
  const res = await fetch(`/api/leitor/pages/${id}.json`);
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

export default function Leitor({ params }: { params: { id: string } }) {
  const imagesQuery = useQuery<ImagesResponse, ErrorResponse>({
    queryKey: ['leitor', params.id],
    queryFn: () => fetchImagesLinks(params.id),
  });

  const { add } = useViewed();
  const idChapter = parseInt(params.id);

  useEffect(() => {
    add(idChapter);
  }, [add, idChapter]);

  const images = imagesQuery.data?.images ?? [];

  return (
    <div className='flex flex-col items-center mb-3'>
      <Paginas images={images} />
      <CommentSection idChapter={idChapter} />
    </div>
  );
}
