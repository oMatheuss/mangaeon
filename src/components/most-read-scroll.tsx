import Link from 'next/link';
import { MostRead } from '@/types/most-read';
import Image from 'next/image';
import { SectionTitle } from '@/components/section-title';

interface MostReadScrollProps {
  items: MostRead[];
  focused: MostRead;
}

export const MostReadScroll = ({ items, focused }: MostReadScrollProps) => {
  return (
    <>
      <SectionTitle text='Mais Lidos' />
      <div className='flex flex-col lg:flex-row gap-4'>
        <MostReadFocusCard item={focused} />
        <ul className='pb-4 w-full overflow-x-auto grid grid-flow-col auto-cols-max gap-x-3'>
          {items.map((item) => (
            <MostReadCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </>
  );
};

interface MostReadCardProps {
  item: MostRead;
}

const MostReadCard = ({ item }: MostReadCardProps) => {
  const link = `/manga/${item.id}`;
  return (
    <li className='flex flex-col items-center overflow-hidden rounded-lg shadow-lg bg-base-200 border border-base-content/20'>
      <Link href={link}>
        <div className='overflow-hidden dark:shadow-dark-b shadow-md'>
          <Image
            src={item.cover}
            alt={`Image de ${item.title}.`}
            className='w-40 h-60 object-cover object-center transition-transform hover:scale-110'
            loading='lazy'
            width={160}
            height={240}
          />
        </div>
      </Link>
      <div className='flex items-center h-16 w-32 px-2'>
        <Link
          href={link}
          className='line-clamp-3 w-full text-xs text-center font-bold tracking-wide hover:text-primary'
        >
          {item.title}
        </Link>
      </div>
    </li>
  );
};

interface MostReadFocusCardProps {
  item: MostRead;
}

const MostReadFocusCard = ({ item }: MostReadFocusCardProps) => {
  const link = `/manga/${item.id}`;
  return (
    <li className='mb-4 w-full lg:max-w-screen-lg flex flex-row gap-4 items-center p-4 lg:py-8 overflow-hidden rounded-lg shadow-lg bg-base-200 border border-base-content/20'>
      <div className='shrink-0 overflow-hidden dark:shadow-dark-b shadow-md'>
        <Link href={link}>
          <Image
            src={item.cover}
            alt={`Image de ${item.title}.`}
            className='w-40 h-60 rounded-md shadow-md object-cover object-center'
            loading='lazy'
            width={160}
            height={240}
          />
        </Link>
      </div>
      <div className='text-base-content flex flex-col self-start text-left max-h-60'>
        <Link className='font-extrabold text-3xl' href={link}>
          <h2 className='hover:underline'>{item.title}</h2>
        </Link>
        <p className='text-sm overflow-hidden whitespace-break-spaces text-justify'>
          {item.description}
        </p>
      </div>
    </li>
  );
};
