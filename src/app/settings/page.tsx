import { ThemeSelector } from '@/components/theme-selector';
import { SettingsIcon } from 'lucide-react';
import { type Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Client configurations',
  robots: { index: false, follow: false },
};

export default function Settings() {
  return (
    <>
      <div className='mb-4 mt-8 flex'>
        <SettingsIcon className='mr-2 inline size-8' />
        <h2 className='text-2xl font-bold'>Settings</h2>
      </div>
      <div className='mb-4 grid grid-cols-3 gap-2'>
        <div>
          <label>Theme</label>
          <ThemeSelector />
        </div>
      </div>
    </>
  );
}
