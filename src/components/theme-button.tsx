'use client';

import { useTheme } from '@/lib/client/theme';

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
  const [, setTheme] = useTheme();
  const handleChangeTheme = () => setTheme(theme);
  return (
    <button onClick={handleChangeTheme} {...props}>
      {children}
    </button>
  );
};
