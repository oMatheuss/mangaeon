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
    <div className='group relative flex h-full flex-row items-center justify-between'>
      <select
        {...props}
        className='appearance-none overflow-hidden rounded border border-base-content/20 bg-base-200 py-1 pe-9 ps-2 caret-indigo-600 shadow-lg outline-2 -outline-offset-2 outline-indigo-600 focus:border-indigo-600 focus:outline'
        value={value}
        onChange={handleOnChange}
      >
        {children}
      </select>
      <ChevronDown className='pointer-events-none absolute right-2 h-5 w-5 group-focus-within:text-indigo-600' />
    </div>
  );
};
