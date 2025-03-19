import { postService } from "@services/postService";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { setPosts, setLoading } from "@redux/slices/postsSlice";
import PostCard from "@components/PostCardRectangle/PostCard";
import styles from "./Drafts.module.css";
import { useNavigate } from "react-router-dom";

function Drafts({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { draftPosts, loading } = useAppSelector((state) => state.posts);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(true));
    async function fetchDrafts() {
      try {
        const userPosts = await postService.getUserPosts(userId);
        dispatch(setPosts(userPosts));
      } catch (error) {
        console.error("Error loading user posts:", error);
      } finally {
        dispatch(setLoading(false));
      }
    }
    if (userId) {
      fetchDrafts();
    }
  }, [userId, dispatch]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!draftPosts || draftPosts.length === 0) {
    return <div>No posts avaliable</div>;
  }

  return (
    <div className={styles.postsContainer}>
      {draftPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          style={"initial"}
          onClick={() => handlePostClick(post.id)}
        />
      ))}
    </div>
  );
}

export default Drafts;
