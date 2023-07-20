import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className='flex flex-row border-b'>
      <div className='flex flex-row items-center my-3'>
        <BookOpen className='mr-2' />
        <Link to='/'>MANGÁ LIVRE</Link>
      </div>
    </nav>
  );
};
