import Link from 'next/link';
import { MostRead } from '@/types/most-read';
import Image from 'next/image';

interface MostReadScrollProps {
  items: MostRead[];
}

export const MostReadScroll = ({ items }: MostReadScrollProps) => {
  return (
    <>
      <div className='flex justify-between items-end mt-8 mb-4 border-b border-base-content/10'>
        <h2 className='font-bold text-xl sm:text-2xl'>Mais Lidos</h2>
      </div>
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
        <div className='relative w-32 h-48 overflow-hidden dark:shadow-dark-b shadow-md'>
          <Image
            src={item.cover}
            alt={`Image de ${item.title}.`}
            className='object-cover object-center transition-transform hover:scale-110'
            loading='lazy'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            fill
          />
        </div>
      </Link>
      <div className='flex items-center h-16 w-32 px-2'>
        <Link
          href={link}
          className='line-clamp-3 w-full text-xs text-center font-bold tracking-wide hover:underline'
        >
          {item.title}
        </Link>
      </div>
    </li>
  );
};
