interface AlertProps {
  text: string;
}

export const SuccessAlert = ({ text }: AlertProps) => {
  return (
    <div className='mb-3 w-full bg-primary text-primary-content p-2 rounded text-center'>
      <span>{text}</span>
    </div>
  );
};

export const SecondaryAlert = ({ text }: AlertProps) => {
  return (
    <div className='mb-3 w-full bg-secondary text-secondary-content p-2 rounded text-center'>
      <span>{text}</span>
    </div>
  );
};
