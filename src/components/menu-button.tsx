import { LucideProps, Menu, X } from 'lucide-react';

interface MenuButtonProps extends LucideProps {
  active: boolean;
}

export const MenuButton = ({ active, ...rest }: MenuButtonProps) => {
  return <>{active ? <X {...rest} /> : <Menu {...rest} />}</>;
};
