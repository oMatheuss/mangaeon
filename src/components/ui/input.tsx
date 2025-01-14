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
        'box-border inline-flex h-10 w-full appearance-none rounded-btn border border-base-content/20 bg-base-200 px-4 py-2 leading-none shadow outline-2 -outline-offset-2 outline-primary placeholder:text-base-content/50 hover:border-base-content/50 focus:border-primary focus:outline hover:focus:border-primary',
        className
      )}
      {...rest}
    />
  );
}
Input.displayName = 'Input';

export { Input };
