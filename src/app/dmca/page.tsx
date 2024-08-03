import Link from 'next/link';

export const dynamic = 'force-static';

export default function Dmca() {
  return (
    <div className='my-32 flex flex-col items-center text-center'>
      <h2 className='mb-2 text-xl font-bold tracking-tight text-red-500'>
        Obra Bloqueada
      </h2>
      <p className='mb-8'>
        A obra que você solicitou foi removida devido a uma solicitação de DMCA.
      </p>
      <Link className='text-accent after:content-["_↗"]' href='/'>
        Ir para Home
      </Link>
    </div>
  );
}
