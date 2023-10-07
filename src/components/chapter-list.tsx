import { ViewedIcon } from '@/components/viewed-icon';
import { Chapter } from '@/types/manga';
import Link from 'next/link';

interface ChapterListProps {
  chapters: Chapter[];
}

export const ChapterList = ({ chapters }: ChapterListProps) => {
  return (
    <>
      <h2 className='font-bold text-xl mt-4 mb-2'>Capítulos</h2>
      <ol className='flex flex-col space-y-3 mb-4'>
        {chapters.map((chap) => (
          <ChapterCard key={chap.chapterId} chapter={chap} />
        ))}
      </ol>
    </>
  );
};

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCard = ({ chapter }: ChapterCardProps) => {
  const link = `/leitor/${chapter.chapterId}`;
  const title = chapter.title ? chapter.title : `Capítulo ${chapter.number}`;

  return (
    <li>
      <div className='p-3 w-full border border-base-content/20 rounded-bl-lg rounded-tr-lg bg-base-200 shadow-md space-y-3 grow overflow-hidden'>
        <h3 className='font-extrabold line-clamp-2 text-lg'>
          <ViewedIcon chapterId={chapter.chapterId} className='inline' />{' '}
          <Link
            title={title}
            href={link}
            className='hover:text-secondary'
            prefetch={false}
          >
            {chapter.number} - {title}
          </Link>
        </h3>
        <p className='opacity-75'>
          {chapter.volume && <span>Volume {chapter.volume} - </span>}
          {new Date(chapter.publishAt).toLocaleDateString('pt-br')}
          {' - '}
          <a
            href={chapter.scanlatorWebsite}
            target='_blank'
            className='font-extrabold hover:text-primary'
          >
            {chapter.scanlator}
          </a>
        </p>
      </div>
    </li>
  );
};
