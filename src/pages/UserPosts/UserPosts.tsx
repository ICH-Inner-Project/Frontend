import { postService } from "@services/postService";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { setLimitPosts, setLimitLoading } from "@redux/slices/pagiNationSlice";
import {
  setPaginationMyPosts,
  setPaginationNotMyPosts,
} from "@redux/slices/pagiNationSlice";
import PostCard from "@components/PostCardRectangle/PostCard";
import styles from "./UserPosts.module.css";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button/Button";
import Text from "@components/Text/Text";
import { useState } from "react";

function UserPosts() {
  const dispatch = useAppDispatch();
  // const { posts, loading } = useAppSelector((state) => state.posts);

  const navigate = useNavigate();
  const {
    pageMyPost,
    limitMyPost,
    sortMyPosts,
    loadingMyPosts,
    myPosts,
    pageNotMyPost,
    otherPosts,
    limitNotMyPost,
    sortNotMyPosts,
    loadingOtherPosts,
    onlyMine,
    excludeMine,
  } = useAppSelector((state) => state.pagination);
  const [nextMyPageCount, setNextMyPageCount] = useState(0);
  const [nextNotMyPageCount, setNextNotMyPageCount] = useState(0);
  const currentPosts = onlyMine ? myPosts : otherPosts;
  const currentLimit = onlyMine ? limitMyPost : limitNotMyPost;
  const currentNextPage = onlyMine ? nextMyPageCount : nextNotMyPageCount;
  const setNextPage = onlyMine ? setNextMyPageCount : setNextNotMyPageCount;
  const currentSort = onlyMine ? sortMyPosts : sortNotMyPosts;
  const currentPage = onlyMine ? pageMyPost : pageNotMyPost;
  const setPaginattion = onlyMine
    ? setPaginationMyPosts
    : setPaginationNotMyPosts;
  const currentLoading = onlyMine ? loadingMyPosts : loadingOtherPosts;

  useEffect(() => {
    dispatch(setLimitLoading(true));
    async function fetchUserPosts() {
      try {
        const offset = (currentPage - 1) * currentLimit;
        const nextOffset = currentPage * currentLimit;
        const [userPosts, nextPageUserPosts] = await Promise.all([
          postService.getPosts(
            currentLimit,
            offset,
            onlyMine,
            excludeMine,
            currentSort
          ),
          postService.getPosts(
            currentLimit,
            nextOffset,
            onlyMine,
            excludeMine,
            currentSort
          ),
        ]);

        // const userPosts = await postService.getUserPosts(userId);
        dispatch(setLimitPosts(userPosts));
        setNextPage(nextPageUserPosts.length);
      } catch (error) {
        console.error("Error loading user posts:", error);
      } finally {
        dispatch(setLimitLoading(false));
      }
    }
    fetchUserPosts();
  }, [
    currentPage,
    dispatch,
    currentLimit,
    currentSort,
    onlyMine,
    excludeMine,
    setNextPage,
  ]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const handleNextPage = async () => {
    if (currentPosts.length < currentLimit || currentNextPage === 0) {
      return;
    }

    dispatch(
      setPaginattion({
        page: currentPage + 1,
        limit: currentLimit,
        sort: currentSort,
      })
    );
  };

  const handlePrevPage = () => {
    if (currentPage === 1) {
      return;
    }

    dispatch(
      setPaginattion({
        page: currentPage - 1,
        limit: currentLimit,
        sort: currentSort,
      })
    );
  };

  if (currentLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.userPostsContainer}>
      {!currentLoading && (!currentPosts || currentPosts.length === 0) && (
        <div className={styles.noPostsAvaliable}>No posts avaliable</div>
      )}
      <div className={styles.postsContainer}>
        {currentPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            style={"initial"}
            onClick={() => handlePostClick(post.id)}
          />
        ))}
      </div>
      <div className={styles.paginationContainer}>
        <Button
          text="Prev"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          inlineStyles={{ padding: "10px" }}
        />
        <Text content={`Page ${currentPage}`} />
        <Button
          text="Next"
          onClick={handleNextPage}
          disabled={currentPosts.length < currentLimit || currentNextPage === 0}
          inlineStyles={{ padding: "10px" }}
        />
      </div>
    </div>
  );
}

export default UserPosts;
