import styles from "./Button.module.css";
import React from "react";

interface ButtonProps {
    text: string;
    onClick: () => void;
    inlineStyles?: React.CSSProperties;
}

export default function Button({ text, onClick, inlineStyles }: ButtonProps) {
    return (
        <button className={styles.button} onClick={onClick} style={inlineStyles}>
            {text}
        </button>
    );
}
