interface AlertProps {
  text: string;
}

export const SuccessAlert = ({ text }: AlertProps) => {
  return (
    <div className='mb-3 w-full rounded bg-primary p-2 text-center text-primary-content'>
      <span>{text}</span>
    </div>
  );
};

export const SecondaryAlert = ({ text }: AlertProps) => {
  return (
    <div className='mb-3 w-full rounded bg-secondary p-2 text-center text-secondary-content'>
      <span>{text}</span>
    </div>
  );
};
