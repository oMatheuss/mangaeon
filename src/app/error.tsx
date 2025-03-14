'use client';

import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
}

export default function Error({ error }: ErrorProps) {
  const hardRefresh = () =>  {
    window.location.reload();
    return false;
  }
  return (
    <div className='my-32 flex flex-col items-center text-center'>
      <h2 className='mb-3 text-xl font-bold tracking-tight text-red-500'>
        Internal Error
      </h2>
      <p className='mb-1'>
        {error.name} - {error.message}
      </p>
      {error.digest && <p className='mb-3'>Digest: {error.digest}</p>}
      <Button onClick={hardRefresh}>
        <RotateCcwIcon/>Tentar de Novo
      </Button>
    </div>
  );
}
