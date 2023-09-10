import { SuccessAlert } from '@/components/alert';
import { OfflineWrapper } from '@/components/offline-wrapper';
import { SavedList } from '@/components/saved-list';
import { FolderHeart } from 'lucide-react';

export default async function Offline() {
  const serverDate = new Date().toLocaleString('pt-br', {
    timeZone: 'America/Sao_Paulo', // source: https://www.iana.org/time-zones
  });

  return (
    <>
      <div className='flex mt-8 mb-4'>
        <FolderHeart className='inline h-7 w-7 mr-2 text-blue-500' />
        <h2 className='align-middle font-bold text-2xl'>Obras Salvas</h2>
      </div>

      <OfflineWrapper>
        <SuccessAlert
          text={
            'Você está offline! ' +
            'Mas não se preocupe, continue lendo as obras que baixou. ' +
            'Online por último as: ' +
            serverDate
          }
        />
      </OfflineWrapper>

      <SavedList />
    </>
  );
}
