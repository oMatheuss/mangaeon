interface AlertProps {
  text: string;
}

export const SuccessAlert = ({ text }: AlertProps) => {
  return (
    <div className='mb-3 w-full bg-green-300 dark:bg-green-500 p-2 rounded text-center'>
      <span>{text}</span>
    </div>
  );
};

export const SecondaryAlert = ({ text }: AlertProps) => {
  return (
    <div className='mb-3 w-full bg-slate-200 dark:bg-slate-500 p-2 rounded text-center'>
      <span>{text}</span>
    </div>
  );
};
