import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='my-32 flex flex-col items-center text-center'>
      <h2 className='mb-3 text-xl font-bold tracking-tight text-red-500'>
        404 - Not Found
      </h2>
      <p className='mb-1'>A página que você solicitou não existe 🙁</p>
      <Link
        className='text-blue-600 after:content-["_↗"] dark:text-blue-400'
        href='/'
      >
        Ir para Home
      </Link>
    </div>
  );
}
