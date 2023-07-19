import { BookOpen } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className='flex flex-row border-b'>
      <div className='flex flex-row items-center my-3'>
        <BookOpen className='mr-2' />
        BUG LIVRE
      </div>
    </nav>
  );
};
