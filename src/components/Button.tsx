interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = (props: IButtonProps) => {
  return (
    <button
      className={` text-white bg-[#4681f4] py-2 px-4 rounded-2xl ${
        props.className ? props.className : ''
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
