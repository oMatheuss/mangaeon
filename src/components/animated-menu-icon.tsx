import { LucideProps } from 'lucide-react';

interface AnimatedMenuIconProps extends LucideProps {
  active: boolean;
}

export const AnimatedMenuIcon = ({
  active,
  ...rest
}: AnimatedMenuIconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      {...rest}
    >
      <line
        className='transition-transform duration-300 origin-center'
        x1='4'
        x2='20'
        y1='6'
        y2='6'
        style={{ transform: active ? 'rotate(45deg) translateY(25%)' : '' }}
      />
      <line
        className='transition-transform duration-300 origin-center'
        x1='4'
        x2='20'
        y1='12'
        y2='12'
        style={{ transform: active ? 'rotateY(90deg)' : '' }}
      />
      <line
        className='transition-transform duration-300 origin-center'
        x1='4'
        x2='20'
        y1='18'
        y2='18'
        style={{ transform: active ? 'rotate(-45deg) translateY(-25%)' : '' }}
      />
    </svg>
  );
};
