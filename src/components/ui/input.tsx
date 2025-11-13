import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

function Input(props: InputProps) {
  const { className, ...rest } = props;

  return (
    <input
      className={cn(
        'rounded-field border-base-content/20 bg-base-200 outline-primary placeholder:text-base-content/50 hover:border-base-content/50 focus:border-primary hover:focus:border-primary box-border inline-flex h-10 w-full appearance-none border px-4 py-2 leading-none shadow-sm -outline-offset-2 focus:outline-2',
        className
      )}
      {...rest}
    />
  );
}
Input.displayName = 'Input';

export { Input };
