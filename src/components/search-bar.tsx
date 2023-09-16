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
      className='w-full flex flex-row my-2 group border-base-content/20 rounded shadow'
    >
      <div className='w-full relative border-inherit'>
        <Search className='absolute w-6 h-6 top-2 left-2 pointer-events-none group-focus-within:text-primary' />
        <input
          defaultValue={defaultValue}
          type='search'
          name='q'
          placeholder='Pesquise uma obra'
          className='placeholder:text-base-content/50 w-full border border-inherit border-e-0 bg-base-200 p-2 pl-10 rounded-s focus:border-primary focus:outline outline-2 outline-primary -outline-offset-2 caret-primary'
        />
      </div>
      <button
        aria-label='Pesquisar'
        type='submit'
        className='p-2 border border-inherit border-s-0 bg-base-200 rounded-e focus:outline outline-2 outline-primary -outline-offset-2'
      >
        <CornerUpRight className='w-6 h-6' />
      </button>
    </form>
  );
};
