import { CornerUpRight, Search } from 'lucide-react';
import { Form } from 'react-router-dom';

interface SearchBarProps {
  defaultValue?: string;
  replace?: boolean;
}

export const SearchBar = ({ replace, defaultValue }: SearchBarProps) => {
  return (
    <Form
      method='GET'
      action='/pesquisa'
      className='w-full flex flex-row my-2 group border-light-b dark:border-dark-b rounded shadow'
      replace={replace}
    >
      <div className='w-full relative border-inherit'>
        <Search className='absolute w-6 h-6 top-2 left-2 pointer-events-none group-focus-within:text-indigo-600' />
        <input
          defaultValue={defaultValue}
          type='search'
          name='q'
          placeholder='Pesquise uma obra'
          className='w-full border border-inherit border-e-0 bg-slate-100 dark:bg-dark p-2 pl-10 rounded-s focus:border-indigo-600 focus:outline outline-2 outline-indigo-600 -outline-offset-2 caret-indigo-600'
        />
      </div>
      <button
        aria-label='Pesquisar'
        type='submit'
        className='p-2 border border-inherit border-s-0 bg-slate-100 dark:bg-dark rounded-e focus:outline outline-2 outline-indigo-600 -outline-offset-2'
      >
        <CornerUpRight className='w-6 h-6' />
      </button>
    </Form>
  );
};
