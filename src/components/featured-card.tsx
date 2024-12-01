import Link from 'next/link';
import Image from 'next/image';
import { Manga } from '@/types/manga';

interface FeaturedCardProps {
  item: Manga;
  loading: 'eager' | 'lazy';
}

export function FeaturedCard({ item, loading }: FeaturedCardProps) {
  const link = `/manga/${item.id}`;

  return (
    <li className='relative flex h-full w-full shrink-0 snap-center items-center sm:justify-center'>
      <div className='absolute z-[1] h-full w-full bg-gradient-to-b from-transparent to-base-100/40' />
      <Image
        src={item.cover}
        alt=''
        className='absolute z-[0] h-full w-full overflow-hidden object-cover blur-sm'
        fill
        loading={loading}
        quality={10}
      />

      <div className='z-[2] flex size-full sm:size-[90%]'>
        <Link
          href={link}
          className='relative hidden aspect-[2/3] h-[14.25rem] shrink-0 self-center sm:flex'
        >
          <Image
            src={item.cover}
            alt={`Imagem de ${item.title}`}
            className='rounded-btn object-cover object-center shadow-md'
            width={152}
            height={228}
            loading={loading}
          />
        </Link>
        <div className='flex grow flex-col justify-end p-6 text-left text-base-content contrast-200'>
          <Link
            className='line-clamp-3 text-balance text-3xl font-extrabold hover:underline'
            href={link}
          >
            {item.title}
          </Link>
          <span className='text-sm'>
            {item.updatedAt.toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </li>
  );
}
