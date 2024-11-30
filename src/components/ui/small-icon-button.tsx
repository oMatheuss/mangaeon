import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { type LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

const buttonVariants = cva(
  'rounded-btn p-1 transition-opacity group-hover:opacity-100 group-active:opacity-60 disabled:pointer-events-none group-focus-visible:outline outline-2 outline-offset-2',
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

interface SmallIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: LucideIcon;
  sr?: string;
  asChild?: boolean;
}

const SmallIconButton = forwardRef<HTMLButtonElement, SmallIconButtonProps>(
  (props: SmallIconButtonProps, ref) => {
    const { icon: Icon, className, variant, sr, asChild, ...rest } = props;
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn('group appearance-none p-2 outline-none', className)}
        {...rest}
        ref={ref}
      >
        <span className='sr-only'>{sr}</span>
        <div className={buttonVariants({ variant })}>
          <Icon aria-hidden={true} className='size-5' />
        </div>
      </Comp>
    );
  }
);

SmallIconButton.displayName = 'SmallIconButton';

export { SmallIconButton, buttonVariants };
