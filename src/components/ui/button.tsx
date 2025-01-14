import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex h-10 items-center gap-2 rounded-btn px-3 outline-2 outline-offset-2 transition-[opacity,transform] hover:opacity-75 focus-visible:outline disabled:cursor-not-allowed disabled:opacity-50 motion-safe:enabled:active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-content outline-primary',
        success: 'bg-success text-success-content outline-success',
        destructive: 'bg-error text-error-content outline-error',
        warning: 'bg-warning text-warning-content outline-warning',
        secondary: 'bg-secondary text-secondary-content outline-secondary',
        neutral: 'bg-neutral text-neutral-content outline-neutral',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button(props: ButtonProps) {
  const { className, variant, ...rest } = props;
  return (
    <button className={buttonVariants({ variant, className })} {...rest} />
  );
}

Button.displayName = 'Button';
