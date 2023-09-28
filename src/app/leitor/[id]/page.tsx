import { AddViewed } from '@/components/add-viewed';
import { CommentSection } from '@/components/comment-section';
import { Paginas } from '@/components/paginas';
import { mangadex } from '@/lib/api/mangadex/api';

export default async function Leitor({ params }: { params: { id: string } }) {
  const images = await mangadex.pages(params.id);
  const secure = images.baseUrl.includes('https') ? 'secure' : 'insecure';
  const origin = images.baseUrl.replace(/https?:\/\/(.*)/, '$1');

  return (
    <div className='flex flex-col items-center mb-3'>
      <AddViewed id={params.id} />
      <Paginas
        images={images.srcs.map((src) => `/mangadex/${secure}/${origin}${src}`)}
      />
      <CommentSection chapterId={params.id} />
    </div>
  );
}
