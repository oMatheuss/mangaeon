import { Paginas } from '@/components/paginas';
import { type ErrorResponse, toErrorReponse } from '@/lib/utils';
import { ImagesResponse } from '@/types/images';
import { useQuery } from '@tanstack/react-query';
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

  const images = imagesQuery.data?.images ?? [];

  return (
    <div className='flex flex-col items-center mb-3'>
      <Paginas images={images} />
    </div>
  );
};
