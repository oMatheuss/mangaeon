import type { Chapter, ChaptersWithPagination } from '@/types/manga';
import { ChapterCard } from '@/components/chapter-card';
import { Pagination } from '@/components/ui/pagination';
import * as Tabs from '@radix-ui/react-tabs';

interface ChapterListProps {
  mangaId: string;
  page: number;
  data: ChaptersWithPagination;
}

interface GroupedChapters {
  number: string;
  chapters: Chapter[];
}

const DEFAULT_ORDER: Record<string, number> = { 'pt-br': 1, en: 2, 'es-la': 3 };

const orderByLang = (a: Chapter, b: Chapter) => {
  const priorityA = DEFAULT_ORDER[a.translatedLanguage] || 4;
  const priorityB = DEFAULT_ORDER[b.translatedLanguage] || 4;
  return priorityA - priorityB;
};

const groupByChapter = (data: Chapter[]) =>
  data.reduce((prev, curr) => {
    const group = prev.find((x) => x.number === curr.number);

    if (group) group.chapters.push(curr);
    else prev.push({ number: curr.number, chapters: [curr] });

    return prev;
  }, [] as GroupedChapters[]);

const sortCharpterTranslations = (grouped: GroupedChapters[]) => {
  for (const group of grouped) group.chapters.sort(orderByLang);
  return grouped;
};

const firstChapterId = (group: GroupedChapters) => group.chapters[0].chapterId;

export function ChapterList(props: ChapterListProps) {
  const { page, data } = props;
  const grouped = sortCharpterTranslations(groupByChapter(data.chapters));

  return (
    <>
      <h2 className='mb-2 mt-4 text-xl font-bold'>Capítulos</h2>
      <div className='mb-8 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3'>
        {grouped.map((group) => (
          <Tabs.Root key={group.number} defaultValue={firstChapterId(group)}>
            <Tabs.List className='flex shrink-0 flex-wrap items-center overflow-x-auto rounded-t-box border border-base-content/20 bg-base-200'>
              <div className='h-10 rounded-r-btn bg-secondary px-4 py-1.5'>
                <h4 className='text-lg font-semibold text-secondary-content'>
                  {group.number}
                </h4>
              </div>
              {group.chapters.sort(orderByLang).map((chap) => (
                <Tabs.Trigger
                  key={chap.chapterId}
                  value={chap.chapterId}
                  className='group flex h-10 w-20 shrink-0 px-4 py-2 outline-none'
                >
                  <div className='w-full rounded-btn outline-2 outline-offset-2 outline-primary group-focus-visible:outline group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-content'>
                    {chap.translatedLanguage}
                  </div>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            {group.chapters.map((chap) => (
              <Tabs.Content key={chap.chapterId} value={chap.chapterId} asChild>
                <ChapterCard
                  className='h-20 w-full overflow-hidden border border-t-0 border-base-content/20 bg-base-200 px-4 py-3 shadow-md outline-2 outline-offset-2 outline-primary last:rounded-b-box focus-visible:outline'
                  chapter={chap}
                />
              </Tabs.Content>
            ))}
          </Tabs.Root>
        ))}
      </div>
      <Pagination limit={data.limit} total={data.total} page={page} />
    </>
  );
}
