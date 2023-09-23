import { AddViewed } from '@/components/add-viewed';
import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { mangadex } from '@/lib/api/mangadex/api';

export default async function Leitor({ params }: { params: { id: string } }) {
  const images = await mangadex.pages(params.id);

  return (
    <div className='flex flex-col items-center mb-3'>
      <AddViewed id={params.id} />
      <Paginas images={images.srcs} />
      <CommentSection chapterId={params.id} />
    </div>
  );
}
