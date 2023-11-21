interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
}

const Input = (props: IInputProps) => {
  return (
    <div className='flex w-full flex-col gap-1'>
      <label
        htmlFor='default-input'
        className='block text-sm font-medium text-gray-900 '
      >
        {props.label}
      </label>
      <input
        type='text'
        id='default-input'
        className='bg-gray-50 border border-gray-300 h-11 text-gray-900 text-sm rounded-lg focus:border-gray-400 focus:ring-gray-400 block w-full p-2.5'
        placeholder={props.placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;
