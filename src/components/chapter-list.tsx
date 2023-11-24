import { ViewedIcon } from '@/components/viewed-icon';
import { Chapter } from '@/types/manga';
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
      <ol className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 2xl:grid-cols-3'>
        {groupedByChapter.map((group) => (
          <li key={group.number}>
            {group.chapters.map((chap) => (
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
    <div className='border border-base-content/20 first:rounded-t-lg last:rounded-b-lg p-3 mb-1 last:mb-0 bg-base-200 shadow-md grow overflow-hidden'>
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
        <span className='text-secondary'>{chapter.translatedLanguage}</span>
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
  );
};
