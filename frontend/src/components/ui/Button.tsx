import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

function Button({ className, children, disabled, ...props }: Props) {
  return (
    <button
      type={`submit`}
      disabled={disabled}
      className={`w-full text-center !px-4 !py-2 !bg-primary !text-white rounded-4xl cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
