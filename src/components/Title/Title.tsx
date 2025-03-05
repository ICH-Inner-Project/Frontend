import styles from "./Title.module.css";
import React from "react";

interface TitleProps {
    content: string;
    inlineStyles?: React.CSSProperties;
}

export default function Title({ content, inlineStyles }: TitleProps) {
    return (
        <>
            <h3 className={styles.title} style={inlineStyles}>{content}</h3>
        </>
    );
}
