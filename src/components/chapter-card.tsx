import type { Chapter } from '@/types/manga';
import { CalendarDaysIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { forwardRef } from 'react';

interface ChapterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  chapter: Chapter;
}

const ChapterCard = forwardRef<HTMLDivElement, ChapterCardProps>(
  (props, ref) => {
    const { chapter, ...rest } = props;
    const link =
      chapter.pages > 0 ? `/leitor/${chapter.chapterId}` : chapter.externalUrl;
    const title = chapter.chapterTitle
      ? chapter.chapterTitle
      : `Capítulo ${chapter.number}`;

    // in case there is no pages and no external url
    if (link === null) return;

    return (
      <div {...rest} ref={ref}>
        <div className='flex grow items-center'>
          <Link
            title={title}
            href={link}
            className='truncate text-pretty hover:underline'
            prefetch={false}
          >
            <h3 className='font-extrabold'>{title}</h3>
          </Link>
        </div>
        <div className='flex flex-wrap justify-between gap-1 text-right'>
          {chapter.scanlator && (
            <a
              href={chapter.scanlatorWebsite}
              target='_blank'
              className='truncate underline-offset-2 hover:underline'
            >
              <UsersIcon className='mr-1 inline size-5' />
              <span className='align-middle'>{chapter.scanlator}</span>
            </a>
          )}
          <div className='whitespace-nowrap'>
            <CalendarDaysIcon className='mr-1 inline size-5' />
            <span className='align-middle proportional-nums'>
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
  }
);

ChapterCard.displayName = 'ChapterCard';

export { ChapterCard };
