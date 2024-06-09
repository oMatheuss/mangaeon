import Link from 'next/link';
import Image from 'next/image';
import { Manga } from '@/types/manga';

interface FeaturedCardProps {
  item: Manga;
  loading: 'eager' | 'lazy';
}

export const FeaturedCard = ({ item, loading }: FeaturedCardProps) => {
  const link = `/manga/${item.id}`;

  return (
    <li className='relative flex h-full w-full shrink-0 snap-center items-center sm:justify-center'>
      <div className='absolute z-[1] h-full w-full bg-gradient-to-b from-transparent to-base-300' />
      <Image
        src={item.cover}
        alt={`Imagem de ${item.title}`}
        className='absolute z-[0] h-full w-full object-cover md:blur-sm'
        fill
        loading={loading}
      />

      <div className='flex h-[90%] w-[90%]'>
        <Link
          href={link}
          className='relative z-[2] hidden aspect-[2/3] h-full w-auto self-center sm:flex'
        >
          <Image
            src={item.cover}
            alt={`Imagem de ${item.title}`}
            className='rounded-btn object-cover object-center shadow-md'
            width={192}
            height={288}
            loading={loading}
          />
        </Link>
        <div className='z-[2] flex flex-col justify-end p-2 text-left text-base-content sm:px-6 sm:py-4'>
          <Link
            className='line-clamp-3 text-3xl font-extrabold hover:underline'
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
};
