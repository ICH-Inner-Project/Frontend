import styles from "./Button.module.css";
import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  inlineStyles?: React.CSSProperties;
  disabled?: boolean;
}

export default function Button({
  text,
  onClick,
  inlineStyles,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      style={inlineStyles}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
