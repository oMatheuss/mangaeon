import type { SearchParams, Tag } from '@/types/manga';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import Form from 'next/form';
import { intoArray } from '@/lib/utils';

interface SearchFormProps {
  searchParams: SearchParams;
  tags: Tag[];
}

export function SearchForm(props: SearchFormProps) {
  const { searchParams, tags } = props;
  const id = useId();

  return (
    <Form replace scroll action='/pesquisa'>
      <fieldset className='mb-3 grid grid-cols-1 gap-2 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <label htmlFor={`title-${id}`}>Título</label>
          <Input
            id={`title-${id}`}
            type='text'
            name='title'
            defaultValue={searchParams.title}
          />
        </div>
        <div>
          <label htmlFor={`updatedAtSince-${id}`}>Última Alteração</label>
          <Input
            id={`updatedAtSince-${id}`}
            type='date'
            name='updatedAtSince'
            defaultValue={searchParams.updatedAtSince}
          />
        </div>
        <div>
          <label htmlFor={`contentRating-${id}`}>Classificação</label>
          <Combobox
            id={`contentRating-${id}`}
            name='contentRating'
            multiple
            defaultValue={intoArray(searchParams.contentRating)}
          >
            <ComboboxItem value='safe' label='Seguro' />
            <ComboboxItem value='suggestive' label='Sugestivo' />
            <ComboboxItem value='erotica' label='Erótico' />
          </Combobox>
        </div>
        <div className='lg:col-span-2'>
          <label htmlFor={`includeTag-${id}`}>Incluir Tags</label>
          <Combobox
            id={`includeTag-${id}`}
            name='includeTag'
            multiple
            defaultValue={intoArray(searchParams.includeTag)}
          >
            {tags.map((x) => (
              <ComboboxItem key={x.id} value={x.id} label={x.name} />
            ))}
          </Combobox>
        </div>
      </fieldset>
      <div className='flex gap-2'>
        <Button type='submit'>
          <SearchIcon /> Search
        </Button>
      </div>
    </Form>
  );
}
