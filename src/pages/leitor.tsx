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

const fetchImagesLinks = async (id: string) => {
  const res = await fetch(`/api/leitor/pages/${id}.json`);
  if (!res.ok) throw toErrorReponse(res);
  const imgs: ImagesResponse = await res.json();
  return imgs;
};

export const Leitor = () => {
  const params = useParams<LeitorParams>();

  const imagesQuery = useQuery<ImagesResponse, ErrorResponse>({
    queryKey: ['leitor', params.id],
    queryFn: () => fetchImagesLinks(params.id!),
  });

  const images = imagesQuery.data?.images ?? [];

  return (
    <div className='flex flex-col items-center'>
      <Paginas images={images} />
    </div>
  );
};
