'use client';

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { Input, type InputProps } from '@/components/ui/input';
import { normalize } from '@/lib/utils';

type ComboboxValue = string | number | string[];

type CanPrevent = { preventDefault(): void };
const preventDefault = <T extends CanPrevent>(e: T) => e.preventDefault();

interface IComboboxContext {
  id: string;
  value: ComboboxValue;
  inputValue: string;
  normalizedInputValue: string;
  doFilter: boolean;
  onRemove: (itemValue: string) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onMouseOver: React.MouseEventHandler<HTMLLIElement>;
  onMouseDown: React.MouseEventHandler<HTMLLIElement>;
}

const ComboboxContext = createContext<IComboboxContext>(null!);

interface ComboboxContextImplProps
  extends Omit<
    IComboboxContext,
    'inputValue' | 'setInputValue' | 'normalizedInputValue'
  > {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function ComboboxContextImpl(props: ComboboxContextImplProps) {
  const { children, onOpenChange, open, ...rest } = props;
  const [inputValue, setInputValue] = useState('');
  const normalizedInputValue = normalize(inputValue);
  const value = { inputValue, normalizedInputValue, setInputValue, ...rest };
  return (
    <ComboboxContext value={value}>
      <Popover open={open} onOpenChange={onOpenChange}>
        {children}
      </Popover>
    </ComboboxContext>
  );
}

interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  children:
    | React.ReactElement<ComboboxItemProps>
    | React.ReactElement<ComboboxItemProps>[];
  id?: string;
  disabled?: boolean;
  name?: string;
  multiple?: boolean;
  defaultValue?: ComboboxValue;
}

export function Combobox(props: ComboboxProps) {
  const {
    id: _inputId,
    children,
    disabled = false,
    multiple = false,
    name,
    defaultValue = multiple ? [] : '',
    ...divProps
  } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ComboboxValue>(defaultValue);
  const [doFilter, setFiltering] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const id = useId();

  const handleOpenChange = (open: boolean) => {
    const input = inputRef.current!;
    if (!open) {
      input.removeAttribute('aria-activedescendant');
      setFiltering(false);
    }

    setOpen(open);
  };

  const setActiveElement = (itemRef: HTMLElement, clearActive = true) => {
    const input = inputRef.current!;

    if (clearActive) {
      const active = input.getAttribute('aria-activedescendant');
      if (active) {
        const activeRef = document.getElementById(active);
        if (activeRef) activeRef.dataset.active = '';
      }
    }

    itemRef.scrollIntoView({ block: 'nearest' });
    itemRef.dataset.active = 'true';
    input.setAttribute('aria-activedescendant', itemRef.id);
  };

  const setSelectedElement = (itemRef: HTMLElement) => {
    const itemValue = itemRef.dataset.value as string;

    if (multiple) {
      if (Array.isArray(value)) {
        const index = value.indexOf(itemValue);
        if (index === -1) setValue([...value, itemValue]);
        else {
          const newValue = [...value];
          newValue.splice(index, 1);
          setValue(newValue);
        }
      } else {
        const _value = value.toString();
        if (_value === itemValue) setValue([]);
        else setValue([_value, itemValue]);
      }
    } else {
      setValue(itemValue);
      handleOpenChange(false);
    }
  };

  const onMouseOver = (e: React.MouseEvent<HTMLLIElement>) => {
    const itemRef = e.currentTarget;
    setActiveElement(itemRef);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault(); // prevent input from losing focus
    const itemRef = e.currentTarget;
    setSelectedElement(itemRef);
  };

  const handleInteractOutside = (e: Event) => {
    const target = e.currentTarget;
    if (target instanceof Node) {
      if (target.isSameNode(inputRef.current)) {
        e.preventDefault();
      } else {
        const button = document.getElementById(`button-${id}`);
        if (button?.contains(target)) {
          e.preventDefault();
        }
      }
    }
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const input = ev.currentTarget;
    const activeDescendant = input.getAttribute('aria-activedescendant');

    if (activeDescendant) {
      const element = document.getElementById(activeDescendant);
      if (element) element.dataset.active = 'false';

      input.removeAttribute('aria-activedescendant');
    }

    setFiltering(true);
    if (!open) setOpen(true);
  };

  const handleInputKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    const input = ev.currentTarget;
    const activeDescendant = input.getAttribute('aria-activedescendant');

    if (
      multiple &&
      ev.key === 'Backspace' &&
      input.value.length === 0 &&
      Array.isArray(value) &&
      value.length > 0
    ) {
      const newValue = [...value];
      newValue.pop();
      setValue(newValue);
      return;
    }

    if (!open) {
      if (ev.key === 'ArrowDown') setOpen(true);
      return;
    }

    // listbox is not null only if open
    const listbox = listboxRef.current!;
    const visibleItemsQuery = 'li[role="option"][aria-hidden="false"]';
    const items = listbox.querySelectorAll<HTMLLIElement>(visibleItemsQuery);

    if (items.length === 0) return;

    switch (ev.key) {
      case 'ArrowDown':
        ev.preventDefault();
        if (!activeDescendant) {
          const first = items.item(0);
          setActiveElement(first, false);
        } else {
          for (const [idx, el] of items.entries()) {
            if (el.id === activeDescendant) {
              const next = items.item(idx < items.length - 1 ? idx + 1 : 0);
              setActiveElement(next);
              break;
            }
          }
        }
        break;
      case 'ArrowUp':
        ev.preventDefault();
        if (!activeDescendant) {
          const last = items.item(items.length - 1);
          setActiveElement(last, false);
        } else {
          for (const [idx, el] of items.entries()) {
            if (el.id === activeDescendant) {
              const previous = items.item((idx > 0 ? idx : items.length) - 1);
              setActiveElement(previous);
              break;
            }
          }
        }
        break;
      case 'Enter':
      case 'Tab':
        const activeElement =
          activeDescendant && document.getElementById(activeDescendant);
        if (activeElement) {
          ev.preventDefault();
          setSelectedElement(activeElement);
        }
        break;
    }
  };

  const onClear = () => setValue(multiple ? [] : '');
  const onRemove = (itemValue: string) => {
    if (Array.isArray(value)) {
      const index = value.indexOf(itemValue);
      if (index > -1) {
        const newValue = [...value];
        newValue.splice(index, 1);
        setValue(newValue);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const opts = [...e.currentTarget.selectedOptions];
      setValue(opts.map((o) => o.value));
    } else {
      setValue(e.currentTarget.value);
    }
  };

  const Input = multiple ? ComboboxMultipleInput : ComboboxInput;

  return (
    <div {...divProps}>
      <ComboboxContextImpl
        id={id}
        value={value}
        doFilter={doFilter}
        onRemove={onRemove}
        onMouseOver={onMouseOver}
        onMouseDown={onMouseDown}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Input
          ref={inputRef}
          inputId={_inputId}
          expanded={open}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onClear={onClear}
        />
        <ComboboxList
          id={`listbox-${id}`}
          ref={listboxRef}
          onInteractOutside={handleInteractOutside}
        >
          {children}
        </ComboboxList>
      </ComboboxContextImpl>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        name={name}
        disabled={disabled}
        multiple={multiple}
        aria-hidden='true'
        className='sr-only'
        tabIndex={-1}
      >
        {children}
      </select>
    </div>
  );
}

Combobox.displayName = 'Combobox';

interface ComboboxInputProps
  extends Omit<InputProps, 'id' | 'value' | 'multiple'> {
  inputId?: string;
  expanded: boolean;
  onClear: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function ComboboxInput(props: ComboboxInputProps) {
  const { ref, inputId, disabled, onChange, onClear, expanded, ...rest } =
    props;
  const { id, value, inputValue, setInputValue } = useContext(ComboboxContext);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const _inputValue = ev.target.value;
    if (!_inputValue) onClear();
    setInputValue(_inputValue);
    onChange(ev);
  };

  const updateInputValue = () => {
    if (typeof value === 'string' || typeof value === 'number') {
      const selector = `#${CSS.escape(id)} > option[value="${value}"]`;
      const item = document.querySelector(selector);
      if (item instanceof HTMLOptionElement) {
        setInputValue(item.innerText);
        return;
      }
    }
    setInputValue('');
  };

  useEffect(() => updateInputValue(), [value]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget && e.relatedTarget.id === `listbox-${id}`) {
      e.preventDefault();
      return;
    }
    updateInputValue();
  };

  const handlePointerDownCapture = (e: React.MouseEvent) => {
    e.preventDefault();

    //@ts-ignore
    const inputRef = ref.current as HTMLInputElement;
    if (!document.activeElement?.isSameNode(inputRef)) {
      inputRef.focus();
    }
  };

  return (
    <PopoverAnchor className='relative'>
      <Input
        id={inputId ?? `input-${id}`}
        ref={ref}
        type='text'
        className='pr-10 [&:has(+button:hover)]:border-base-content/50'
        role='combobox'
        autoComplete='off'
        autoCorrect='off'
        spellCheck='false'
        aria-haspopup='listbox'
        aria-controls={`listbox-${id}`}
        aria-activedescendant=''
        aria-expanded={expanded}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
      />
      <ComboboxTrigger
        id={`button-${id}`}
        disabled={disabled}
        onPointerDownCapture={handlePointerDownCapture}
        className='absolute right-0 top-0 shrink-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
      />
    </PopoverAnchor>
  );
}

ComboboxInput.displayName = 'ComboboxInput';

function ComboboxMultipleInput(props: ComboboxInputProps) {
  const { ref, inputId, disabled, onChange, onClear, expanded, ...rest } =
    props;

  const { id, value, inputValue, setInputValue, onRemove } =
    useContext(ComboboxContext);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const _inputValue = ev.target.value;
    setInputValue(_inputValue);
    onChange(ev);
  };

  useEffect(() => setInputValue(''), [value]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget && e.relatedTarget.id === `listbox-${id}`) {
      e.preventDefault();
      return;
    }
    setInputValue('');
  };

  const handlePointerDownCapture = (e: React.MouseEvent) => {
    e.stopPropagation();

    //@ts-ignore
    const inputRef = ref.current as HTMLInputElement;

    if (!inputRef.isSameNode(e.target as Node)) {
      e.preventDefault();

      if (!document.activeElement?.isSameNode(inputRef)) {
        inputRef.focus();
      }
    }
  };

  return (
    <PopoverAnchor
      role='combobox'
      aria-haspopup={true}
      className='relative min-h-10 w-full cursor-text rounded-btn border border-base-content/20 bg-base-200 pl-4 pr-10 leading-none shadow outline-2 -outline-offset-2 outline-primary focus-within:border-primary focus-within:outline hover:border-base-content/50 hover:focus-within:border-primary'
      aria-expanded={expanded}
      aria-labelledby={rest['aria-labelledby']}
      onPointerDownCapture={handlePointerDownCapture}
    >
      <ul className='my-[.4375rem] flex w-full flex-wrap gap-1'>
        <ComboboxTags
          values={value as string[]}
          selectId={id}
          onRemove={onRemove}
        />
        <li className='h-6 grow'>
          <input
            id={inputId ?? `input-${id}`}
            ref={ref}
            type='text'
            className='size-full min-w-0 appearance-none bg-base-200 outline-none placeholder:text-base-content/50'
            role='searchbox'
            aria-autocomplete='list'
            autoCapitalize='none'
            autoComplete='off'
            autoCorrect='off'
            spellCheck='false'
            aria-controls={`listbox-${id}`}
            aria-activedescendant=''
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            size={2}
            {...rest}
          />
        </li>
      </ul>
      <ComboboxTrigger
        id={`button-${id}`}
        disabled={disabled}
        className='absolute right-0 top-[-1px] shrink-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
      />
    </PopoverAnchor>
  );
}

ComboboxMultipleInput.displayName = 'ComboboxMultipleInput';

interface ComboboxTagsProps {
  selectId: string;
  values: string[];
  onRemove: (itemValue: string) => void;
}

function ComboboxTags(props: ComboboxTagsProps) {
  const { values, selectId, onRemove } = props;
  const [tags, setTags] = useState<{ l: string; v: string }[]>([]);

  useEffect(() => {
    const _tags = [];
    for (const val of values) {
      const selector = `#${CSS.escape(selectId)} > option[value="${val}"]`;
      const label = document.querySelector(selector)?.textContent;
      if (label) _tags.push({ l: label, v: val });
    }
    setTags(_tags);
  }, [values]);

  return tags.map(({ l, v }) => (
    <li
      key={v}
      className='flex h-6 items-center rounded-btn bg-primary px-1 text-primary-content'
    >
      <span className='block break-keep text-xs'>{l}</span>
      <button
        type='button'
        tabIndex={-1}
        onClick={() => onRemove(v)}
        className='-mr-1 size-6 p-1'
      >
        <XIcon className='size-4' />
      </button>
    </li>
  ));
}

ComboboxTags.displayName = 'ComboboxTags';

interface ComboboxTriggerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'type' | 'tabIndex'
  > {}

function ComboboxTrigger(props: ComboboxTriggerProps) {
  return (
    <PopoverTrigger tabIndex={-1} type='button' {...props}>
      <div className='m-2 size-6 rounded-btn bg-primary p-1'>
        <ChevronDownIcon
          aria-hidden={true}
          className='size-4 text-primary-content'
        />
      </div>
    </PopoverTrigger>
  );
}

ComboboxTrigger.displayName = 'ComboboxTrigger';

interface ComboboxListProps {
  id?: string;
  ref?: React.Ref<HTMLUListElement>;
  onInteractOutside(e: Event): void;
  children: React.ReactNode;
}

function ComboboxList(props: ComboboxListProps) {
  const { children, onInteractOutside, ref, id } = props;
  return (
    <PopoverContent
      className='z-50 overflow-y-auto rounded-btn border border-base-content/30 bg-base-200 shadow-md data-[side="bottom"]:animate-slideDownAndFade data-[side="top"]:animate-slideUpAndFade'
      style={{
        transformOrigin: 'var(--radix-popover-content-transform-origin)',
        width: 'var(--radix-popover-trigger-width)',
        maxHeight: 'calc(var(--radix-popover-content-available-height) - 5px)',
      }}
      sideOffset={5}
      avoidCollisions={true}
      onOpenAutoFocus={preventDefault}
      onCloseAutoFocus={preventDefault}
      onInteractOutside={onInteractOutside}
      hideWhenDetached={true}
    >
      <ul ref={ref} id={id} role='listbox' tabIndex={-1} className='p-1'>
        {children}
      </ul>
    </PopoverContent>
  );
}

ComboboxList.displayName = 'ComboboxList';

interface ComboboxItemProps {
  label: string;
  value: string;
}

export function ComboboxItem(props: ComboboxItemProps) {
  const { label, value } = props;
  const searchText = normalize(label);

  const id = useId();
  const ctx = useContext(ComboboxContext);

  if (!ctx) return <option value={value}>{label}</option>;

  const ariaSelected =
    typeof ctx.value === 'string' || typeof ctx.value === 'number'
      ? props.value === ctx.value
      : ctx.value.indexOf(props.value) > -1;

  const ariaHidden =
    searchText.search(ctx.normalizedInputValue) === -1 && ctx.doFilter;

  return (
    <li
      id={id}
      role='option'
      aria-selected={ariaSelected}
      aria-hidden={ariaHidden}
      data-value={value}
      onMouseDown={ctx.onMouseDown}
      onMouseOver={ctx.onMouseOver}
      className='group relative flex w-full cursor-default items-center text-balance rounded-btn py-1.5 pl-8 pr-2 text-sm aria-hidden:hidden data-[active=true]:bg-accent data-[active=true]:text-accent-content'
    >
      <span className='invisible absolute left-2 flex h-3.5 w-3.5 items-center justify-center group-aria-selected:visible'>
        <CheckIcon className='size-4' />
      </span>
      {label}
    </li>
  );
}

ComboboxItem.displayName = 'ComboboxItem';
