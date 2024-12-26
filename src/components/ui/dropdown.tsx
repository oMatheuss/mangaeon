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
          'z-50 min-w-32 overflow-hidden rounded-btn border border-base-content/20 bg-base-200 p-1 text-base-content shadow-md will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade',
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
        'relative flex cursor-default select-none items-center gap-2 rounded-btn px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-content data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      {...rest}
    />
  );
}
DropdownMenuItem.displayName = Item.displayName;
