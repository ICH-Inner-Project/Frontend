import styles from "./Link.module.css";
import React from "react";

interface LinkProps {
  text: string;
  onClick: () => void;
  inlineStyles?: React.CSSProperties;
}

export default function Link({ text, onClick, inlineStyles }: LinkProps) {
  return (
    <>
      <a className={styles.link} onClick={onClick} style={inlineStyles}>
        {text}
      </a>
    </>
  );
}
