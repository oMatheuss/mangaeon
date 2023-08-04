interface MenuButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active: boolean;
}

export const MenuButton = ({ active, ...rest }: MenuButtonProps) => {
  return (
    <button {...rest}>
      <div
        data-active={active}
        className='relative group w-full h-full flex flex-col justify-around'
      >
        <span className='group-data-[active=true]:absolute transition-transform transform w-full h-[2px] rounded bg-current group-data-[active=true]:rotate-45'></span>
        <span className='transition-opacity transform w-full h-[2px] rounded bg-current group-data-[active=true]:opacity-0'></span>
        <span className='group-data-[active=true]:absolute transition-transform transform w-full h-[2px] rounded bg-current group-data-[active=true]:-rotate-45'></span>
      </div>
    </button>
  );
};
