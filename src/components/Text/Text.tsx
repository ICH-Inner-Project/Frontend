import styles from "./Text.module.css";
import React from "react";

interface TextProps {
    content: string;
    inlineStyles?: React.CSSProperties;
}

export default function Text({ content, inlineStyles }: TextProps) {
    return (
        <>
            <p className={styles.text} style={inlineStyles}>{content}</p>
        </>
    );
}
