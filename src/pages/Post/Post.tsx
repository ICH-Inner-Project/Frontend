import { useParams } from "react-router-dom";
import { postService } from "@services/postService";
import { useState, useEffect } from "react";
import { PostResponse } from "@customTypes/postTypes";
import PostCard from "@components/PostCardRectangle/PostCard";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { removePost, setPosts } from "@redux/slices/postsSlice";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    setLoading(true);
    async function fetchPost() {
      if (!postId) return;
      try {
        setLoading(true);
        const fetchedPost = await postService.getPost(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  function calculateReadingTime(text: string): string {
    const length = text.length;
    if (length < 100) return "1 min read";
    if (length <= 400) return "3 min read";
    if (length <= 700) return "5 min read";
    return "more than 5 min read";
  }

  function formatData(data: string | undefined): string {
    if (!data) return "N/A";
    const timestamp = Number(data);
    if (isNaN(timestamp)) return "Invalid data";
    const createData = new Date(timestamp).toISOString().split("T")[0];
    return createData.split("-").reverse().join(".");
  }

  async function handleDeletePost() {
    if (!postId || !post) return;
    const beforPosts = await postService.getUserPosts(post.authorId);
    console.log(beforPosts, "beforPosts");
    const succes = await postService.deletePost(postId);
    dispatch(removePost(postId));
    if (succes) {
      const updatedPosts = await postService.getUserPosts(post.authorId);
      console.log(updatedPosts, "updatedPosts");
      dispatch(setPosts(updatedPosts));
      navigate("/home");
    }
  }

  if (loading) {
    return <div>{loading}</div>;
  }

  const isAuthor = !!(post && currentUser && currentUser.id === post.authorId);

  return (
    <div className={styles.container}>
      {post && (
        <PostCard
          key={post.id}
          imgUrl={post.image}
          title={post.title}
          content={post.content}
          style={"primary"}
          onClick={() => {}}
          date={formatData(post.publishedAt)}
          time={calculateReadingTime(post.content)}
          onDeleteClick={() => {
            handleDeletePost();
          }}
          isAuthor={isAuthor}
        />
      )}
    </div>
  );
}

export default Post;
