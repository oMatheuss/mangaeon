import { ArrowLeft, ArrowRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  offset: number;
}

export const Pagination = ({ page, total, limit }: PaginationProps) => {
  const actions = [];

  const maxPage = Math.ceil(total / limit);
  if (page > 1) {
    actions.push({ type: 'link', number: 1 });
  }
  if (page - 1 === 2) {
    actions.push({ type: 'link', number: 2 });
  }
  if (page - 1 > 2) {
    actions.push({ type: 'dots', number: page - 2 });
    actions.push({ type: 'link', number: page - 1 });
  }
  actions.push({ type: 'actual', number: page });
  if (page + 1 === maxPage - 1) {
    actions.push({ type: 'link', number: maxPage - 1 });
  } else if (page + 1 < maxPage - 1) {
    actions.push({ type: 'link', number: page + 1 });
    actions.push({ type: 'dots', number: page + 2 });
  }
  if (page < maxPage) {
    actions.push({ type: 'link', number: maxPage });
  }

  return (
    <div className='flex flex-row items-center justify-center flex-wrap gap-6'>
      {page < 2 ? (
        <span className='flex items-center justify-center w-10 h-10 rounded-full opacity-50'>
          <ArrowLeft className='w-8 h-8' aria-label='Página anterior' />
        </span>
      ) : (
        <Link
          href={{ query: { page: (page - 1).toString() } }}
          className='flex items-center justify-center w-10 h-10 rounded-full focus:outline-none hover:bg-base-content/10'
        >
          <ArrowLeft className='w-8 h-8' aria-label='Página anterior' />
        </Link>
      )}

      {actions.map((x) => {
        switch (x.type) {
          case 'link':
            return (
              <Link
                key={x.number}
                href={{ query: { page: x.number?.toString() } }}
                className='flex items-center justify-center w-10 h-10 rounded-lg focus:outline-none hover:bg-base-content/10 aria-disabled:pointer-events-none aria-disabled:opacity-50'
              >
                <span className='text-lg'>{x.number}</span>
              </Link>
            );
          case 'dots':
            return (
              <div
                key={x.number}
                className='flex items-center justify-center w-10 h-10'
              >
                <MoreHorizontal className='w-8 h-8' />
              </div>
            );
          case 'actual':
            return (
              <div
                key={x.number}
                className='flex items-center justify-center w-10 h-10 text-lg bg-primary text-primary-content rounded-lg'
              >
                {x.number}
              </div>
            );
          default:
            throw new Error('sorry, my fault');
        }
      })}

      {page > maxPage - 1 ? (
        <span className='flex items-center justify-center w-10 h-10 rounded-full opacity-50'>
          <ArrowRight className='w-8 h-8' aria-label='Proxima página' />
        </span>
      ) : (
        <Link
          href={{ query: { page: (page + 1).toString() } }}
          className='flex items-center justify-center w-10 h-10 rounded-full focus:outline-none hover:bg-base-content/10'
        >
          <ArrowRight className='w-8 h-8' aria-label='Proxima página' />
        </Link>
      )}
    </div>
  );
};
