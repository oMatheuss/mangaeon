import Link from 'next/link';
import { MostRead } from '@/types/most-read';
import Image from 'next/image';
import { SectionTitle } from '@/components/section-title';

interface MostReadScrollProps {
  items: MostRead[];
}

export const MostReadScroll = ({ items }: MostReadScrollProps) => {
  return (
    <>
      <SectionTitle text='Mais Procurados' />
      <div className='flex flex-col gap-4 lg:flex-row'>
        <ul className='grid w-full auto-cols-max grid-flow-col gap-x-3 overflow-x-auto pb-4'>
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
    <li className='flex flex-col items-center overflow-hidden rounded-lg border border-base-content/20 bg-base-200 shadow-lg'>
      <Link href={link}>
        <div className='overflow-hidden rounded-b-lg'>
          <Image
            src={item.cover}
            alt={`Image de ${item.title}.`}
            className='h-48 w-32 object-cover object-center transition-transform hover:scale-110 sm:h-60 sm:w-40'
            loading='lazy'
            width={160}
            height={240}
          />
        </div>
      </Link>
      <div className='flex h-16 w-32 items-center px-2 sm:w-40'>
        <Link
          href={link}
          className='line-clamp-3 w-full text-center text-xs font-bold tracking-wide hover:text-primary'
        >
          {item.title}
        </Link>
      </div>
    </li>
  );
};
