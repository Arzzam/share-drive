interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = (props: IButtonProps) => {
  return (
    <button
      className={`bg-slate-900 text-white ${
        props.className ? props.className : ''
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
