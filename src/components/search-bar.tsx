'use client';

import { CornerUpRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
}

export const SearchBar = ({ defaultValue }: SearchBarProps) => {
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchParams = new URLSearchParams();
    searchParams.set('q', formData.get('q') as string);
    router.push('/pesquisa?' + searchParams.toString());
  };

  return (
    <form
      method='GET'
      action='/pesquisa'
      onSubmit={handleSearch}
      className='group my-2 flex w-full flex-row rounded border-base-content/20 shadow'
    >
      <div className='relative w-full border-inherit'>
        <Search className='pointer-events-none absolute left-2 top-2 h-6 w-6 group-focus-within:text-primary' />
        <input
          defaultValue={defaultValue}
          type='search'
          name='q'
          placeholder='Pesquise uma obra'
          className='w-full rounded-s border border-e-0 border-inherit bg-base-200 p-2 pl-10 caret-primary outline-2 -outline-offset-2 outline-primary placeholder:text-base-content/50 focus:border-primary focus:outline'
        />
      </div>
      <button
        aria-label='Pesquisar'
        type='submit'
        className='rounded-e border border-s-0 border-inherit bg-base-200 p-2 outline-2 -outline-offset-2 outline-primary focus:outline'
      >
        <CornerUpRight className='h-6 w-6' />
      </button>
    </form>
  );
};
