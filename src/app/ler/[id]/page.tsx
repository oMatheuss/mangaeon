import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import { useViewed } from '@/lib/viewed';
import { ImagesResponse } from '@/types/images';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const fetchImagesLinks = async (id: string): Promise<ImagesResponse> => {
  const res = await fetch(`/api/leitor/pages/${id}.json`);
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

export const Leitor = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const imagesQuery = useQuery<ImagesResponse, ErrorResponse>({
    queryKey: ['leitor', id],
    queryFn: () => fetchImagesLinks(id),
  });

  const { add } = useViewed();
  const idChapter = parseInt(id);

  useEffect(() => {
    add(idChapter);
  }, []);

  const images = imagesQuery.data?.images ?? [];

  return (
    <div className='flex flex-col items-center mb-3'>
      <Paginas images={images} />
      <CommentSection idChapter={idChapter} />
    </div>
  );
};
