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
      <SectionTitle text='Mais Lidos' />
      <ul className='w-full pb-4 overflow-x-auto grid grid-flow-col auto-cols-max gap-x-3'>
        {items.map((item) => (
          <MostReadCard key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
};

interface MostReadCardProps {
  item: MostRead;
}

const MostReadCard = ({ item }: MostReadCardProps) => {
  const link = `/manga/${item.id}`;
  return (
    <li className='flex flex-col items-center overflow-hidden shadow-md bg-base-200 rounded-lg border border-base-content/20'>
      <Link href={link}>
        <div className='overflow-hidden dark:shadow-dark-b shadow-md'>
          <Image
            src={item.cover}
            alt={`Image de ${item.title}.`}
            className='w-32 h-48 object-cover object-center transition-transform hover:scale-110'
            loading='lazy'
            width={128}
            height={192}
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
