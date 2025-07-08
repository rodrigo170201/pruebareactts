import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: "primary" | "success" | "danger";
};

export const Button = ({ children, className = "", variant = "primary", ...props }: ButtonProps) => {
  const variantClasses =
    variant === "primary"
      ? "bg-blue-500 hover:bg-blue-600"
      : variant === "success"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";

  return (
    <button
      {...props}
      className={`text-white py-1 px-4 rounded cursor-pointer ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};
