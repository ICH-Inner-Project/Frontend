interface PostCardProps {
  date: string;
  time: string;
  imgUrl: string;
  title: string;
  content: string;
}

export default function PostCard({
  date,
  time,
  imgUrl,
  title,
  content,
}: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <div className={styles.postDateTime}>
        {date} {time}
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
