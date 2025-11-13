import { CornerUpRight, Search } from 'lucide-react';
import Form from 'next/form';

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar(props: SearchBarProps) {
  const { defaultValue } = props;

  return (
    <Form
      action='/search'
      className='group rounded-field border-base-content/20 hover:border-base-content/50 my-4 flex w-full shadow-sm'
    >
      <div className='relative w-full border-inherit'>
        <Search className='group-focus-within:text-primary pointer-events-none absolute top-2 left-2 size-6' />
        <input
          defaultValue={defaultValue}
          type='search'
          name='title'
          spellCheck={false}
          placeholder='Pesquise uma obra'
          className='rounded-s-field bg-base-200 caret-primary outline-primary placeholder:text-base-content/50 focus:border-primary box-border h-10 w-full appearance-none border border-e-0 border-inherit p-2 pl-10 -outline-offset-2 focus:outline-2'
        />
      </div>
      <button
        aria-label='Pesquisar'
        type='submit'
        className='rounded-e-field bg-base-200 outline-primary box-border size-10 appearance-none border border-l-0 border-inherit p-2 -outline-offset-2 focus:outline-2'
      >
        <CornerUpRight className='size-6' />
      </button>
    </Form>
  );
}
