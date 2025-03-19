import React from "react";
import styles from "./Styles.module.css";

interface PostCardProps {
  date: string;
  time: string;
  imgUrl: string;
  title: string;
  content: string;
  createdAt: string; // Дата создания поста
  readTime: string; // Время чтения
}

export default function PostCard({
  date,
  time,
  imgUrl,
  title,
  content,
  createdAt,
  readTime,
}: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <div className={styles.postDateTime}>
        created: {createdAt} | {readTime} read
      </div>
      <img
        className={styles.postImage}
        src="https://img.freepik.com/free-photo/closeup-shot-leopard-south-africa_181624-30374.jpg"
        alt="Post"
      />
      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>{title}</h2>
        <p className={styles.postText}>{content}</p>
      </div>
    </div>
  );
}
