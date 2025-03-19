import { useParams } from "react-router-dom";
import { postService } from "@services/postService";
import { useState, useEffect } from "react";
import PostCard from "@components/PostCardRectangle/PostCard";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { removePost, setPosts, setCurrentPost } from "@redux/slices/postsSlice";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { UserResponse } from "@customTypes/userTypes";
import { usersService } from "@services/usersService";

function Post() {
  const { postId } = useParams();
  const curentPost = useAppSelector((state) => state.posts.currentPost);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentUser, setCurentUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;
      setLoading(true);
      try {
        const fetchedPost = await postService.getPost(postId);
        dispatch(setCurrentPost(fetchedPost));
        const fetchedUser = await usersService.getUser();
        setCurentUser(fetchedUser);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId, dispatch]);

  function calculateReadingTime(text: string): string {
    const length = text.length;
    if (length < 100) return "1 min read";
    if (length <= 400) return "3 min read";
    if (length <= 700) return "5 min read";
    return "more than 5 min read";
  }

  async function handleDeletePost() {
    if (!postId || !curentPost) return;
    const succes = await postService.deletePost(postId);
    dispatch(removePost(postId));
    if (succes) {
      const updatedPosts = await postService.getUserPosts(curentPost.authorId);
      dispatch(setPosts(updatedPosts));
      navigate("/home");
    }
  }

  if (loading) {
    return <div>Loading ...</div>;
  }

  const isAuthor = !!(
    curentPost &&
    currentUser &&
    currentUser.id === curentPost.authorId
  );

  return (
    <div className={styles.container}>
      {curentPost && (
        <PostCard
          key={curentPost.id}
          post={curentPost}
          style={"primary"}
          time={calculateReadingTime(curentPost.content)}
          onDeleteClick={handleDeletePost}
          isAuthor={isAuthor}
        />
      )}
    </div>
  );
}

export default Post;
