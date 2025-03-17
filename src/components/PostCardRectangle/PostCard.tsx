import { useState } from "react";
import { PostResponse } from "@customTypes/postTypes";
import styles from "./Styles.module.css";
import PostModal from "@pages/PostModal/PostModal";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: PostResponse;
  time?: string;
  isAuthor?: boolean;
  style?: string;
  onClick?: () => void;
  onDeleteClick?: () => void;
}

interface Post {
  id: string;
  title: string;
  content: string;
  description: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export default function PostCard({
  post,
  time,
  isAuthor,
  style,
  onClick,
  onDeleteClick,
}: PostCardProps) {
  enum PostCardStyle {
    INITIAL = "initial",
    PRIMARY = "primary",
    SECONDARY = "secondary",
  }
  const navigate = useNavigate();
  function formatData(data: string | undefined): string {
    if (!data) return "N/A";
    const timestamp = Number(data);
    if (isNaN(timestamp)) return "Invalid data";
    const createData = new Date(timestamp).toISOString().split("T")[0];
    return createData.split("-").reverse().join(".");
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  function openDialog(post: PostResponse) {
    const { image, ...postWithoutImage } = post;
    console.log(image);
    setSelectedPost(postWithoutImage);
    setIsDialogOpen(true);
  }

  async function closeDialog() {
    setIsDialogOpen(false);
    setSelectedPost(null);
  }

  function navigateToPosts() {
    navigate("/home");
  }

  return (
    <>
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
            <div className={styles.settingsContainer}>
              <span
                className="material-symbols-outlined"
                onClick={navigateToPosts}
              >
                arrow_back
              </span>
              {isAuthor && (
                <div className={styles.settingsContainer}>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => openDialog(post)}
                  >
                    edit
                  </span>
                  <span
                    className="material-symbols-outlined"
                    onClick={onDeleteClick}
                  >
                    delete
                  </span>
                </div>
              )}
            </div>
            <div className={styles.postDateAndTimeContainer}>
              {post.publishedAt && (
                <p>created: {formatData(post.publishedAt)}</p>
              )}
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
            post.image ||
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
            {post.title}
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
            {style === PostCardStyle.INITIAL ? post.description : post.content}
          </p>
        </div>
      </div>
      {isDialogOpen && selectedPost && (
        <PostModal
          onCloseDialog={closeDialog}
          post={selectedPost}
          isNewPost={false}
        />
      )}
    </>
  );
}
