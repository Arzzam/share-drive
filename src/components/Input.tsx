interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
}

const Input = (props: IInputProps) => {
  return (
    <>
      <label
        htmlFor='default-input'
        className='block text-sm font-medium text-gray-900 '
      >
        {props.label}
      </label>
      <input
        type='text'
        id='default-input'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        placeholder={props.placeholder}
        {...props}
      />
    </>
  );
};

export default Input;
