interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = (props: IButtonProps) => {
  return (
    <button
      className={`py-2.5 px-5 text-sm font-medium rounded-xl border text-white bg-blue-600 hover:bg-blue-800 ${
        props.className ? props.className : ''
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
