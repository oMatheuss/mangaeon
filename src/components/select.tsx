import { ChevronDown } from 'lucide-react';

interface SelectProps
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    'value' | 'onChange' | 'children' | 'className'
  > {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select = ({
  value,
  onChange,
  children,
  ...props
}: SelectProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  return (
    <div className='group relative mb-3 flex items-center'>
      <select
        {...props}
        className='cursor-pointer appearance-none overflow-hidden rounded-btn border border-base-content/20 bg-base-200 py-1 pe-8 ps-2 caret-primary shadow outline-2 -outline-offset-2 outline-primary focus:outline'
        value={value}
        onChange={handleOnChange}
      >
        {children}
      </select>
      <ChevronDown className='pointer-events-none absolute right-2 size-4' />
    </div>
  );
};
