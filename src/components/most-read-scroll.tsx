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
      <div className='flex flex-col lg:flex-row gap-4'>
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
        <div className='overflow-hidden rounded-b-lg'>
          <Image
            src={item.cover}
            alt={`Image de ${item.title}.`}
            className='w-32 h-48 sm:w-40 sm:h-60 object-cover object-center transition-transform hover:scale-110'
            loading='lazy'
            width={160}
            height={240}
          />
        </div>
      </Link>
      <div className='flex items-center h-16 w-32 sm:w-40 px-2'>
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
