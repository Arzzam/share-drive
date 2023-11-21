interface IFileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FileInput = (props: IFileInputProps) => {
  return (
    <div className='flex w-full flex-col gap-1'>
      <label
        htmlFor='file-input'
        className='block text-sm font-medium text-gray-900 '
      >
        Choose file
      </label>
      <input
        type='file'
        multiple
        name='file-input'
        id='file-input'
        className='h-11 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-gray-400 focus:ring-gray-400 file:border-0 file:bg-gray-200 file:me-4 file:py-3 file:px-4 hover:file:bg-gray-400 hover:placeholder:bg-slate-300 hover:border-gray-400 hover:ring-gray-400'
        {...props}
      />
    </div>
  );
};

export default FileInput;
