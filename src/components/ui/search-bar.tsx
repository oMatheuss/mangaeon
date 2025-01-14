import { CornerUpRight, Search } from 'lucide-react';
import Form from 'next/form';

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar(props: SearchBarProps) {
  const { defaultValue } = props;

  return (
    <Form
      action='/pesquisa'
      className='group my-4 flex w-full rounded-btn border-base-content/20 shadow hover:border-base-content/50'
    >
      <div className='relative w-full border-inherit'>
        <Search className='pointer-events-none absolute left-2 top-2 size-6 group-focus-within:text-primary' />
        <input
          defaultValue={defaultValue}
          type='search'
          name='title'
          spellCheck={false}
          placeholder='Pesquise uma obra'
          className='box-border h-10 w-full appearance-none rounded-s-btn border border-e-0 border-inherit bg-base-200 p-2 pl-10 caret-primary outline-2 -outline-offset-2 outline-primary placeholder:text-base-content/50 focus:border-primary focus:outline'
        />
      </div>
      <button
        aria-label='Pesquisar'
        type='submit'
        className='box-border size-10 appearance-none rounded-e-btn border border-l-0 border-inherit bg-base-200 p-2 outline-2 -outline-offset-2 outline-primary focus:outline'
      >
        <CornerUpRight className='size-6' />
      </button>
    </Form>
  );
}
