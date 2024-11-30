'use client';

interface ThemeButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  theme: string;
}

export function ThemeButton(props: ThemeButtonProps) {
  const { children, theme, ...rest } = props;

  const handleChangeTheme = () => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <button onClick={handleChangeTheme} {...rest}>
      {children}
    </button>
  );
}
