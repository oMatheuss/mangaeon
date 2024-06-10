'use client';

interface ThemeButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  theme: string;
}

export const ThemeButton = ({
  children,
  theme,
  ...props
}: ThemeButtonProps) => {
  const handleChangeTheme = () => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };
  return (
    <button onClick={handleChangeTheme} {...props}>
      {children}
    </button>
  );
};
