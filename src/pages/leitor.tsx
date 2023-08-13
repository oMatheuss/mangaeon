import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import { useViewed } from '@/lib/viewed';
import { ImagesResponse } from '@/types/images';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

type LeitorParams = {
  name: string;
  id: string;
  chap: string;
};

const fetchImagesLinks = async (id: string): Promise<ImagesResponse> => {
  const res = await fetch(`/api/leitor/pages/${id}.json`);
  if (!res.ok) throw toErrorReponse(res);
  return await res.json();
};

export const Leitor = () => {
  const params = useParams<LeitorParams>();

  const imagesQuery = useQuery<ImagesResponse, ErrorResponse>({
    queryKey: ['leitor', params.id],
    queryFn: () => fetchImagesLinks(params.id!),
  });

  const { add } = useViewed();
  const idChapter = parseInt(params.id!);

  useEffect(() => {
    add(idChapter);
  }, []);

  const images = imagesQuery.data?.images ?? [];

  return (
    <div className='flex flex-col items-center mb-3'>
      <Paginas images={images} />
      <hr className='w-full border border-light-b dark:border-dark-b rounded my-3' />
      <CommentSection idChapter={idChapter} />
    </div>
  );
};
