import { ViewedIcon } from '@/components/viewed-icon';
import { Chapter } from '@/types/manga';
import { CalendarDaysIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

interface ChapterListProps {
  chapters: Chapter[];
}

interface GroupedChapters {
  number: string;
  chapters: Chapter[];
}

export const ChapterList = ({ chapters }: ChapterListProps) => {
  const groupedByChapter = chapters.reduce((prev, curr) => {
    const group = prev.find((x) => x.number === curr.number);

    if (group) group.chapters.push(curr);
    else prev.push({ number: curr.number, chapters: [curr] });

    return prev;
  }, [] as GroupedChapters[]);

  return (
    <>
      <h2 className='font-bold text-xl mt-4 mb-2'>Capítulos</h2>
      <ol className='mb-8 grid grid-cols-1 gap-8'>
        {groupedByChapter.map((group) => (
          <li key={group.number}>
            {group.chapters
              .sort((a, b) =>
                a.translatedLanguage.localeCompare(b.translatedLanguage)
              )
              .map((chap) => (
                <ChapterCardItem key={chap.chapterId} chapter={chap} />
              ))}
          </li>
        ))}
      </ol>
    </>
  );
};

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCardItem = ({ chapter }: ChapterCardProps) => {
  const link = `/leitor/${chapter.chapterId}`;
  const title = chapter.title ? chapter.title : `Capítulo ${chapter.number}`;

  return (
    <div className='border border-base-content/20 first:rounded-t last:rounded-b p-2 mb-1 last:mb-0 bg-base-200 shadow-md grow overflow-hidden'>
      <div className='flex items-center grow'>
        <div className='min-w-12 text-sm text-center bg-neutral text-neutral-content rounded mr-1 whitespace-nowrap inline-block'>
          {chapter.translatedLanguage}
        </div>
        <ViewedIcon
          chapterId={chapter.chapterId}
          className='inline w-4 h-4 mr-1'
        />
        <Link
          title={title}
          href={link}
          className='hover:text-primary line-clamp-3 text-pretty'
          prefetch={false}
        >
          <h3 className='font-extrabold'>
            {chapter.number} - {title}
          </h3>
        </Link>
      </div>
      <div className='flex flex-wrap text-right justify-between gap-1'>
        {chapter.scanlator && (
          <a
            href={chapter.scanlatorWebsite}
            target='_blank'
            className='hover:text-secondary truncate'
          >
            <UsersIcon className='inline w-4 h-4 mr-1' />
            <span>{chapter.scanlator}</span>
          </a>
        )}
        <div className='whitespace-nowrap'>
          <CalendarDaysIcon className='inline w-4 h-4 mr-1' />
          <span className='proportional-nums'>
            {new Date(chapter.publishAt).toLocaleDateString('pt-br', {
              day: '2-digit',
              year: '2-digit',
              month: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
