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
    <div className='relative h-full flex flex-row justify-between items-center group'>
      <select
        {...props}
        className='bg-base-200 border border-base-content/20 shadow-lg rounded py-1 ps-2 pe-9 overflow-hidden appearance-none focus:border-indigo-600 focus:outline outline-2 outline-indigo-600 -outline-offset-2 caret-indigo-600'
        value={value}
        onChange={handleOnChange}
      >
        {children}
      </select>
      <ChevronDown className='pointer-events-none absolute right-2 h-5 w-5 group-focus-within:text-indigo-600' />
    </div>
  );
};
