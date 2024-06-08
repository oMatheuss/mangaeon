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
      <h2 className='mb-2 mt-4 text-xl font-bold'>Capítulos</h2>
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
  const link =
    chapter.pages > 0 ? `/leitor/${chapter.chapterId}` : chapter.externalUrl;
  const title = chapter.chapterTitle
    ? chapter.chapterTitle
    : `Capítulo ${chapter.number}`;

  // in case there is no pages and no external url
  if (link === null) return;

  return (
    <div className='mb-1 grow overflow-hidden border border-base-content/20 bg-base-200 p-2 shadow-md first:rounded-t last:mb-0 last:rounded-b'>
      <div className='flex grow items-center'>
        <div className='mr-1 inline-block min-w-12 whitespace-nowrap rounded bg-neutral text-center text-sm text-neutral-content'>
          {chapter.translatedLanguage}
        </div>
        <ViewedIcon
          chapterId={chapter.chapterId}
          className='mr-1 inline h-4 w-4'
        />
        <Link
          title={title}
          href={link}
          className='line-clamp-3 text-pretty hover:text-primary'
          prefetch={false}
        >
          <h3 className='font-extrabold'>
            {chapter.number} - {title}
          </h3>
        </Link>
      </div>
      <div className='flex flex-wrap justify-between gap-1 text-right'>
        {chapter.scanlator && (
          <a
            href={chapter.scanlatorWebsite}
            target='_blank'
            className='truncate hover:text-secondary'
          >
            <UsersIcon className='mr-1 inline h-4 w-4' />
            <span>{chapter.scanlator}</span>
          </a>
        )}
        <div className='whitespace-nowrap'>
          <CalendarDaysIcon className='mr-1 inline h-4 w-4' />
          <span className='proportional-nums'>
            {chapter.publishAt.toLocaleDateString('pt-br', {
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
