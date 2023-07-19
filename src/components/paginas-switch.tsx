import { Chapter } from '@/types/chapters';
import { StepBack, StepForward } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PaginasSwitchProps {
  next?: Chapter;
  prev?: Chapter;
  actual?: Chapter;
}

export const PaginasSwitch = ({ prev, next, actual }: PaginasSwitchProps) => {
  return (
    <div className='w-full flex flex-row justify-evenly items-center my-3'>
      <div>
        {prev ? (
          <Link to={`../../${prev.id_chapter}/${prev.number}`} relative='path'>
            <StepBack className='w-6 h-6 md:w-12 md:h-12' />
          </Link>
        ) : (
          <StepBack className='w-6 h-6 md:w-12 md:h-12 text-opacity-50' />
        )}
      </div>
      <div>Cap. {actual?.number}</div>
      <div>
        {next ? (
          <Link to={`../../${next.id_chapter}/${next.number}`} relative='path'>
            <StepForward className='w-6 h-6 md:w-12 md:h-12' />
          </Link>
        ) : (
          <StepForward className='w-6 h-6 md:w-12 md:h-12 text-opacity-50' />
        )}
      </div>
    </div>
  );
};
