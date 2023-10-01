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
      <ol className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4'>
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

  return (
    <li className='w-full flex flex-row justify-between items-center border border-base-content/20 p-2 rounded-bl-lg rounded-tr-lg bg-base-200 shadow-md'>
      <div className='flex flex-col'>
        <Link
          title={`Ler capítulo ${chapter.number}`}
          href={link}
          className='hover:underline'
        >
          Capítulo {chapter.number}
        </Link>
        <span className='font-bold text-xs opacity-75'>
          Volume {chapter.volume}
        </span>
      </div>
      <div className='flex flex-col items-end'>
        {/* <div className='proportional-nums'>{chapter.date}</div> */}
        <div className='flex flex-row space-x-3 items-center'>
          <ViewedIcon className='w-4 h-4' chapterId={chapter.chapterId} />
        </div>
      </div>
    </li>
  );
};
