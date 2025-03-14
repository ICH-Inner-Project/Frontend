import { postService } from "@services/postService";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { setPosts, setLoading } from "@redux/slices/postsSlice";
import PostCard from "@components/PostCardRectangle/PostCard";
import styles from "./UserPosts.module.css";
import { useNavigate } from "react-router-dom";
import Post from "@pages/Post/Post";

function UserPosts({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { posts, loading } = useAppSelector((state) => state.posts);
  useEffect(() => {
    dispatch(setLoading(true));
    async function fetchUserPosts() {
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
      fetchUserPosts();
    }
  }, [userId, dispatch]);

  const navigate = useNavigate();
  const handlePostClick = (postId: string) => {
    <Post />;
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts avaliable</div>;
  }

  return (
    <div className={styles.postsContainer}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          imgUrl={post.image}
          title={post.title}
          content={post.content}
          style={"initial"}
          onClick={() => handlePostClick(post.id)}
        />
      ))}
    </div>
  );
}

export default UserPosts;
