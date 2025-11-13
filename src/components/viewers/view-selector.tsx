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
        className='rounded-field border-base-content/20 bg-base-200 caret-primary outline-primary w-full cursor-pointer appearance-none overflow-hidden border py-1 ps-2 pe-8 shadow-sm -outline-offset-2 focus:outline-2'
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
