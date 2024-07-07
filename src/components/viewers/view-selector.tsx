import { ChevronDown } from 'lucide-react';
import { useId } from 'react';

interface ViewSelectorProps
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    'value' | 'onChange' | 'className'
  > {
  value: string;
  onChange: (value: string) => void;
  syncClient?: boolean;
}

export default function ViewSelector({
  value,
  onChange,
  syncClient,
  id: _id,
  children,
  ...props
}: ViewSelectorProps) {
  const id = useId();
  const inputId = _id ?? id;
  const labelId = `label${id}`;

  return (
    <div className='group relative mb-3 flex w-full max-w-prose items-center'>
      <label className='sr-only' id={labelId} htmlFor={inputId}>
        Tipo de Visualização
      </label>
      <select
        {...props}
        id={inputId}
        suppressHydrationWarning
        className='w-full cursor-pointer appearance-none overflow-hidden rounded-btn border border-base-content/20 bg-base-200 py-1 pe-8 ps-2 caret-primary shadow outline-2 -outline-offset-2 outline-primary focus:outline'
        value={value}
        data-value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
      <ChevronDown className='pointer-events-none absolute right-2 size-4' />
    </div>
  );
}
