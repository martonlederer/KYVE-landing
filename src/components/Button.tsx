import { HTMLProps, PropsWithChildren } from "react";
import styles from "../styles/components/Button.module.sass";

const Button = ({
  buttonSize = "large",
  className,
  children,
  onClick,
}: PropsWithChildren<ButtonProps>) => (
  <button
    className={
      styles.Button + " " + styles[`ButtonSize_${buttonSize}`] + " " + className
    }
    onClick={onClick}
  >
    {children}
  </button>
);

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  buttonSize?: "small" | "large";
}

export default Button;
