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
    <div className='flex flex-row flex-wrap items-center justify-center gap-6'>
      {page < 2 ? (
        <span className='flex h-10 w-10 items-center justify-center rounded-full opacity-50'>
          <ArrowLeft className='h-8 w-8' aria-label='Página anterior' />
        </span>
      ) : (
        <Link
          href={{ query: { page: (page - 1).toString() } }}
          className='flex h-10 w-10 items-center justify-center rounded-full hover:bg-base-content/10 focus:outline-none'
        >
          <ArrowLeft className='h-8 w-8' aria-label='Página anterior' />
        </Link>
      )}

      {actions.map((x) => {
        switch (x.type) {
          case 'link':
            return (
              <Link
                key={x.number}
                href={{ query: { page: x.number?.toString() } }}
                className='flex h-10 w-10 items-center justify-center rounded-btn hover:bg-base-content/10 focus:outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50'
              >
                <span className='text-lg'>{x.number}</span>
              </Link>
            );
          case 'dots':
            return (
              <div
                key={x.number}
                className='flex h-10 w-10 items-center justify-center'
              >
                <MoreHorizontal className='h-8 w-8' />
              </div>
            );
          case 'actual':
            return (
              <div
                key={x.number}
                className='flex h-10 w-10 items-center justify-center rounded-btn bg-primary text-lg text-primary-content'
              >
                {x.number}
              </div>
            );
          default:
            throw new Error('sorry, my fault');
        }
      })}

      {page > maxPage - 1 ? (
        <span className='flex h-10 w-10 items-center justify-center rounded-full opacity-50'>
          <ArrowRight className='h-8 w-8' aria-label='Proxima página' />
        </span>
      ) : (
        <Link
          href={{ query: { page: (page + 1).toString() } }}
          className='flex h-10 w-10 items-center justify-center rounded-full hover:bg-base-content/10 focus:outline-none'
        >
          <ArrowRight className='h-8 w-8' aria-label='Proxima página' />
        </Link>
      )}
    </div>
  );
};
