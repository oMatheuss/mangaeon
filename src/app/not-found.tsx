import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='my-32 flex flex-col items-center text-center'>
      <h2 className='mb-3 tracking-tight font-bold text-xl text-red-500'>
        404 - Not Found
      </h2>
      <p className='mb-1'>A página que você solicitou não existe 🙁</p>
      <Link
        className='text-blue-600 dark:text-blue-400 after:content-["_↗"]'
        href='/'
      >
        Ir para Home
      </Link>
    </div>
  );
}
