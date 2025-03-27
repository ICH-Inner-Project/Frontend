import { useParams } from "react-router-dom";
import { postService } from "@services/postService";
import { useState, useEffect } from "react";
import PostCard from "@components/PostCardRectangle/PostCard";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { removePost, setPosts, setCurrentPost } from "@redux/slices/postsSlice";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { setCurrentUser } from "@redux/slices/usersSlice";
import { usersService } from "@services/usersService";
import {
  setPaginationMyPosts,
  setLimitPosts,
} from "@redux/slices/pagiNationSlice";

function Post() {
  const { postId } = useParams();
  const curentPost = useAppSelector((state) => state.posts.currentPost);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [currentUser, setCurentUser] = useState<UserResponse | null>(null);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const { pageMyPost, limitMyPost, sortMyPosts, onlyMine, excludeMine } =
    useAppSelector((state) => state.pagination);

  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;
      setLoading(true);
      try {
        const fetchedPost = await postService.getPost(postId);
        dispatch(setCurrentPost(fetchedPost));
        const fetchedUser = await usersService.getUser();
        dispatch(setCurrentUser(fetchedUser));
      } catch (error) {
        console.log(error);
        if (
          error instanceof Error &&
          error.message === "Not authorized. Please log in."
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId, dispatch, navigate]);

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
    if (succes) {
      dispatch(removePost(postId));
      const updatedPosts = await postService.getUserPosts(curentPost.authorId);
      const offset = (pageMyPost - 1) * limitMyPost;
      const updatedLimitedPosts = await postService.getPosts(
        limitMyPost,
        offset,
        onlyMine,
        excludeMine,
        sortMyPosts
      );
      dispatch(setPosts(updatedPosts));
      dispatch(setLimitPosts(updatedLimitedPosts));
      navigate("/home");

      if (updatedPosts.length === 0 && pageMyPost > 1) {
        dispatch(
          setPaginationMyPosts({
            page: pageMyPost - 1,
            limit: limitMyPost,
            sort: sortMyPosts,
          })
        );
      }
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading ...</div>;
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
