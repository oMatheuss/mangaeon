'use client';

import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
} from '@radix-ui/react-dropdown-menu';
import type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
} from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

export const DropdownMenu = Root;
export const DropdownMenuTrigger = Trigger;

export function DropdownMenuContent(
  props: DropdownMenuContentProps & { ref?: React.Ref<HTMLDivElement> }
) {
  const { className, sideOffset = 4, ref, ...rest } = props;
  return (
    <Portal>
      <Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'rounded-field border-base-content/20 bg-base-200 text-base-content data-[side=bottom]:animate-slide-up-and-fade data-[side=left]:animate-slide-right-and-fade data-[side=right]:animate-slide-left-and-fade data-[side=top]:animate-slide-down-and-fade z-50 min-w-32 overflow-hidden border p-1 shadow-md will-change-[opacity,transform]',
          className
        )}
        {...rest}
      />
    </Portal>
  );
}
DropdownMenuContent.displayName = Content.displayName;

export function DropdownMenuItem(
  props: DropdownMenuItemProps & { ref?: React.Ref<HTMLDivElement> }
) {
  const { className, ref, ...rest } = props;
  return (
    <Item
      ref={ref}
      className={cn(
        'rounded-field focus:bg-accent focus:text-accent-content relative flex cursor-default items-center gap-2 px-2 py-1.5 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      {...rest}
    />
  );
}
DropdownMenuItem.displayName = Item.displayName;
