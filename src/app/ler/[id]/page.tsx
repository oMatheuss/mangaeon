import { AddViewed } from '@/components/add-viewed';
import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { ImagesResponse } from '@/types/images';

export const revalidate = 3600;

const fetchImagesLinks = async (id: string): Promise<ImagesResponse> => {
  const res = await fetch(`https://mangalivre.net/leitor/pages/${id}.json`);
  if (!res.ok) throw res;
  return (await res.json()) as ImagesResponse;
};

export default async function Leitor({ params }: { params: { id: string } }) {
  const imagesRes = await fetchImagesLinks(params.id);
  const images = imagesRes.images;

  const idChapter = parseInt(params.id);

  return (
    <div className='flex flex-col items-center mb-3'>
      <AddViewed id={idChapter} />
      <Paginas images={images} />
      <CommentSection idChapter={idChapter} />
    </div>
  );
}
