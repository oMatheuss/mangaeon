'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='my-32 flex flex-col items-center text-center'>
      <h2 className='mb-3 text-xl font-bold tracking-tight text-red-500'>
        500 - Internal Server Error
      </h2>
      <p className='mb-1'>
        {error.name} - {error.message}
      </p>
      {error.digest && <p className='mb-1'>Digest: {error.digest}</p>}
      <button
        className='text-blue-600 after:content-["_↗"] dark:text-blue-400'
        onClick={reset}
      >
        Tentar de Novo
      </button>
    </div>
  );
}
