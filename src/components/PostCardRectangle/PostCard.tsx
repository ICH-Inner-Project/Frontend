import styles from "./Styles.module.css";

interface PostCardProps {
  imgUrl?: string;
  title: string;
  content: string;
  date?: string;
  time?: string;
  style?: string;
  isAuthor?: boolean;
  onClick?: () => void;
  onDeleteClick?: () => void;
}

export default function PostCard({
  imgUrl,
  title,
  content,
  date,
  time,
  style,
  isAuthor,
  onClick,
  onDeleteClick,
}: PostCardProps) {
  enum PostCardStyle {
    INITIAL = "initial",
    PRIMARY = "primary",
    SECONDARY = "secondary",
  }

  return (
    <div
      className={
        style === PostCardStyle.INITIAL
          ? styles.postCardInitial
          : style === PostCardStyle.PRIMARY
          ? styles.postCardPrimary
          : styles.postCardSecondary
      }
      onClick={onClick}
    >
      {style === PostCardStyle.PRIMARY && (
        <div className={styles.topContainer}>
          {isAuthor && (
            <div className={styles.settingsContainer}>
              <span className="material-symbols-outlined">edit</span>
              <span
                className="material-symbols-outlined"
                onClick={onDeleteClick}
              >
                delete
              </span>
            </div>
          )}

          <div className={styles.postDateAndTimeContainer}>
            {date && <p>created: {date}</p>}
            {time && <p>{time}</p>}
          </div>
        </div>
      )}
      <img
        className={
          style === PostCardStyle.INITIAL
            ? styles.postImageInitial
            : style === PostCardStyle.PRIMARY
            ? styles.postImagePrimary
            : styles.postImageSecondary
        }
        src={
          imgUrl ||
          "https://img.freepik.com/free-photo/closeup-shot-leopard-south-africa_181624-30374.jpg"
        }
        alt="Post"
      />
      <div
        className={
          style === PostCardStyle.INITIAL
            ? styles.postContentInitial
            : style === PostCardStyle.PRIMARY
            ? styles.postContentPrimary
            : styles.postContentSecondary
        }
      >
        <h2
          className={
            style === PostCardStyle.INITIAL
              ? styles.postTitleInitial
              : style === PostCardStyle.PRIMARY
              ? styles.postTitlePrimary
              : styles.postTitleSecondary
          }
        >
          {title}
        </h2>
        <p
          className={
            style === PostCardStyle.INITIAL
              ? styles.postTextInitial
              : style === PostCardStyle.PRIMARY
              ? styles.postTextPrimary
              : styles.postTextSecondary
          }
        >
          {content}
        </p>
      </div>
    </div>
  );
}
