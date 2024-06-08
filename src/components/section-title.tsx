interface SectionTitleProps {
  text: string;
}

export const SectionTitle = (props: SectionTitleProps) => {
  return (
    <div className='mb-4 mt-8 flex items-end justify-between border-b border-base-content/10'>
      <h2 className='text-xl font-bold sm:text-2xl'>{props.text}</h2>
    </div>
  );
};
