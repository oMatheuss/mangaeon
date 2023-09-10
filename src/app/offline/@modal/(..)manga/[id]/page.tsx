'use client';

import { useOfflineApi } from '@/components/offline-api-context';
import type { SavedChapter } from '@/types/saved-chapter';
import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MangaModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const offlineApi = useOfflineApi();
  const [chapterList, setChapterList] = useState<SavedChapter[]>([]);
  //const [onLoading, setLoading] = useState(true);

  useEffect(() => {
    const id = parseInt(params.id);
    offlineApi.getChapters().then((val) => {
      setChapterList(val.filter((x) => x.mangaId === id));
    });
    //.finally(() => setLoading(false));
  }, [offlineApi]);

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && router.back()}>
      <Dialog.Portal>
        <Dialog.Overlay className='z-20 bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='z-30 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-light dark:bg-dark p-[25px] shadow-lg focus:outline-none'>
          <Dialog.Title className='m-0 text-[17px] font-medium'>
            Capítulos Salvos
          </Dialog.Title>
          <Dialog.Description className='mt-[10px] mb-5 text-[15px] leading-normal'>
            Selecione um capítulo para visualizar
          </Dialog.Description>

          <ul className='divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto'>
            {chapterList.map((chapter) => (
              <li key={chapter.chapterId} className='py-3 sm:py-4'>
                <div className='flex items-center space-x-4'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
                      {chapter.name}
                    </p>
                    <p className='text-sm text-gray-500 truncate dark:text-gray-400'>
                      Capítulo {chapter.chapter}
                    </p>
                  </div>
                  <Link
                    href={`/ler/${chapter.chapterId}`}
                    aria-label={`Ver capítulos do manga ${chapter.name}`}
                    className='w-8 h-8 inline-flex items-center justify-center text-base text-gray-900 rounded-full hover:bg-light-b focus:outline-none focus:ring-2 focus:ring-light-b dark:text-gray-400 dark:hover:bg-dark-b dark:focus:ring-dark-b'
                  >
                    <ArrowRight className='w-6 h-6' />
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <Dialog.Close asChild>
            <button
              className='focus:shadow-indigo-600 absolute top-[10px] right-[10px] inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
              aria-label='Close'
            >
              <XIcon className='w-6 h-6 hover:stroke-indigo-600' />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
