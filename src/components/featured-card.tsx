import Link from 'next/link';
import { HighLights } from '@/types/highlights';
import Image from 'next/image';

interface FeaturedCardProps {
  item: HighLights;
}

export const FeaturedCard = ({ item }: FeaturedCardProps) => {
  const link = `/manga/${item.id}`;

  return (
    <li className='relative flex sm:justify-center items-center snap-center h-full w-full shrink-0'>
      <div className='absolute w-full h-full z-[1] bg-gradient-to-b from-base-100/20 to-base-100' />
      <Image
        src={item.cover}
        alt={`Imagem de ${item.title}`}
        className='object-cover absolute w-full h-full z-[0] md:blur-sm'
        fill
      />

      <div className='flex w-[90%] h-[90%]'>
        <Link
          href={link}
          className='relative hidden sm:flex aspect-[2/3] w-auto h-full z-10 self-center'
        >
          <Image
            src={item.cover}
            alt={`Imagem de ${item.title}`}
            className='object-cover object-center rounded'
            width={192}
            height={288}
          />
        </Link>
        <div className='text-base-content flex flex-col justify-end text-left p-2 sm:px-6 sm:py-4 z-10'>
          <Link
            className='font-extrabold text-3xl hover:underline line-clamp-3'
            href={link}
          >
            {item.title}
          </Link>
          <span className='text-sm'>
            {item.date.toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </li>
  );
};
