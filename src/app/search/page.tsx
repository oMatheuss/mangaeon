import { SearchForm } from '@/components/search-form';
import { SearchResult } from '@/components/search-result';

import { mangadex } from '@/lib/api/mangadex/api';
import type { SearchParams } from '@/types/manga';

interface SearchProps {
  searchParams: Promise<SearchParams>;
}

export const dynamic = 'force-dynamic';

export default async function Search(props: SearchProps) {
  const searchParams = await props.searchParams;
  const tags = await mangadex.tags();
  const result = await mangadex.search(searchParams);

  return (
    <section className='mt-6'>
      <SearchForm searchParams={searchParams} tags={tags} />
      <SearchResult series={result} />
    </section>
  );
}
