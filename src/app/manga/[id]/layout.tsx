interface LayoutProps {
  children: React.ReactNode;
  chapters: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children, chapters } = props;

  return (
    <div className='flex flex-col'>
      {children}
      {chapters}
    </div>
  );
}
