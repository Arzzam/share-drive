interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = (props: IButtonProps) => {
  return (
    <button
      className={`py-2.5 px-5 font-sans text-sm font-semibold rounded-lg text-white border ${
        props.className ? props.className : ''
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
