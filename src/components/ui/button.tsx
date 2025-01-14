import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'rounded-btn inline-flex gap-2 items-center px-3 h-10 transition-opacity hover:opacity-100 active:opacity-60 focus-visible:outline outline-2 outline-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary/75 text-primary-content outline-primary',
        success: 'bg-success/75 text-success-content outline-success',
        destructive: 'bg-error/75 text-error-content outline-error',
        warning: 'bg-warning/75 text-warning-content outline-warning',
        secondary: 'bg-secondary/75 text-secondary-content outline-secondary',
        neutral: 'bg-neutral/75 text-neutral-content outline-neutral',
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
