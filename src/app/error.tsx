'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='my-32 flex flex-col items-center text-center'>
      <h2 className='mb-3 tracking-tight font-bold text-xl text-red-500'>
        500 - Internal Server Error
      </h2>
      <p className='mb-1'>
        {error.name} - {error.message}
      </p>
      {error.digest && <p className='mb-1'>Digest: {error.digest}</p>}
      <button
        className='text-blue-600 dark:text-blue-400 after:content-["_↗"]'
        onClick={reset}
      >
        Tentar de Novo
      </button>
    </div>
  );
}
