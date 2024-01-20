interface SectionTitleProps {
  text: string;
}

export const SectionTitle = (props: SectionTitleProps) => {
  return (
    <div className='flex justify-between items-end mt-8 mb-4 border-b border-base-content/10'>
      <h2 className='font-bold text-xl sm:text-2xl'>{props.text}</h2>
    </div>
  );
};
